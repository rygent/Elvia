import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Event } from '#lib/structures/Event.js';
import { Collection } from '@discordjs/collection';
import type { DiscordAPIError } from '@discordjs/rest';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { bold, hideLinkEmbed, hyperlink, italic, underscore } from '@discordjs/formatters';
import { formatArray, formatPermissions, isNsfwChannel, resolveCommandName } from '#lib/utils/Functions.js';
import { Env } from '@aviana/env';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'interactionCreate',
			once: false
		});
	}

	public async run(interaction: CommandInteraction<'cached' | 'raw'>) {
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

		const command = this.client.interactions.get(resolveCommandName(interaction));
		if (command) {
			if (command.disabled && !this.client.owners?.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is currently inaccessible.', ephemeral: true });
			}

			if (command.guildOnly && !interaction.inCachedGuild()) {
				return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
			}

			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPermissions
					? this.client.defaultPermissions.add(command.memberPermissions)
					: this.client.defaultPermissions;

				if (memberPermCheck) {
					const missing = interaction.channel
						?.permissionsFor(interaction.member as GuildMember)
						?.missing(memberPermCheck) as string[];

					if (missing.length) {
						const replies = `You lack the ${formatArray(
							missing.map((item) => underscore(italic(formatPermissions(item))))
						)} permission(s) to continue.`;

						return interaction.reply({ content: replies, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPermissions
					? this.client.defaultPermissions.add(command.clientPermissions)
					: this.client.defaultPermissions;

				if (clientPermCheck) {
					const missing = interaction.channel
						?.permissionsFor(interaction.guild?.members.me as GuildMember)
						?.missing(clientPermCheck) as string[];

					if (missing.length) {
						const replies = `I lack the ${formatArray(
							missing.map((item) => underscore(italic(formatPermissions(item))))
						)} permission(s) to continue.`;

						return interaction.reply({ content: replies, ephemeral: true });
					}
				}

				if (command.nsfw && !isNsfwChannel(interaction.channel)) {
					const replies = `This command is only accessible on ${bold('Age-Restricted')} channels.`;

					return interaction.reply({ content: replies, ephemeral: true });
				}
			}

			if (command.ownerOnly && !this.client.owners?.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is only accessible for developers.', ephemeral: true });
			}

			if (!this.client.cooldowns.has(resolveCommandName(interaction))) {
				this.client.cooldowns.set(resolveCommandName(interaction), new Collection());
			}

			const now = Date.now();
			const cooldown = this.client.cooldowns.get(resolveCommandName(interaction));

			if (cooldown?.has(interaction.user.id) && !this.client.owners?.includes(interaction.user.id)) {
				const expired = (cooldown.get(interaction.user.id) as number) + command.cooldown;

				if (now < expired) {
					const duration = (expired - now) / 1e3;
					return interaction
						.reply({ content: `You've to wait ${bold(duration.toFixed(2))} second(s) to continue.`, ephemeral: true })
						.then(() => setTimeout(() => interaction.deleteReply(), expired - now));
				}
			}

			cooldown?.set(interaction.user.id, now);
			setTimeout(() => cooldown?.delete(interaction.user.id), command.cooldown);

			try {
				await command.execute(interaction);
			} catch (e: unknown) {
				if ((e as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
				if (interaction.replied) return;
				this.client.logger.error(`${(e as Error).name}: ${(e as Error).message}`, e as Error, true);

				const replies = [
					'An error has occured when executing this command, our developers have been informed.',
					`If the issue persists, please contact us in our ${hyperlink(
						'Support Server',
						hideLinkEmbed(Env.SupportServerUrl)
					)}.`
				].join('\n');

				if (interaction.deferred) return interaction.editReply({ content: replies });
				return interaction.reply({ content: replies, ephemeral: true });
			}
		}
	}
}
