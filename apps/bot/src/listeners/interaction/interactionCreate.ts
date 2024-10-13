import { Client, Listener } from '@elvia/tesseract';
import { type BaseInteraction, Events, type GuildMember } from 'discord.js';
import { Collection } from '@discordjs/collection';
import type { DiscordAPIError } from '@discordjs/rest';
import { bold, hideLinkEmbed, hyperlink, italic, underline, subtext } from '@discordjs/formatters';
import { formatArray, formatPermissions, isNsfwChannel } from '@/lib/utils/Functions.js';
import { Env } from '@/lib/Env.js';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.InteractionCreate,
			once: false
		});
	}

	// eslint-disable-next-line complexity
	public async run(interaction: BaseInteraction<'cached' | 'raw'>) {
		// Handle slash & context menu commands
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			let command = this.client.commands.find((cmd) => cmd.name === interaction.commandName);

			if (interaction.isChatInputCommand()) {
				const subCommand = interaction.options.getSubcommand(false);
				const subCommandGroup = interaction.options.getSubcommandGroup(false);

				const commandName = subCommand
					? this.client.commands.filter(
							(cmd) =>
								cmd.group ===
								(subCommandGroup ? `${interaction.commandName}.${subCommandGroup}` : interaction.commandName)
						)
					: this.client.commands;

				command = commandName.find((cmd) => cmd.name === (subCommand ?? interaction.commandName));
			}

			if (command) {
				if (!command.enabled) {
					return interaction.reply({ content: 'This command is currently inaccessible.', ephemeral: true });
				}

				if (command.guild && !interaction.inCachedGuild()) {
					return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
				}

				if (interaction.inGuild()) {
					if (interaction.inCachedGuild()) {
						const userPermsCheck = command.userPermissions
							? this.client.defaultPermissions.add(command.userPermissions)
							: this.client.defaultPermissions;

						if (userPermsCheck) {
							const missing = interaction.channel
								?.permissionsFor(interaction.member)
								?.missing(userPermsCheck) as string[];

							// eslint-disable-next-line max-depth
							if (missing.length) {
								const replies = `You lack the ${formatArray(
									missing.map((item) => underline(italic(formatPermissions(item))))
								)} permission(s) to continue.`;

								return interaction.reply({ content: replies, ephemeral: true });
							}
						}

						const clientPermsCheck = command.clientPermissions
							? this.client.defaultPermissions.add(command.clientPermissions)
							: this.client.defaultPermissions;

						if (clientPermsCheck) {
							const missing = interaction.channel
								?.permissionsFor(interaction.guild?.members.me as GuildMember)
								?.missing(clientPermsCheck) as string[];

							// eslint-disable-next-line max-depth
							if (missing.length) {
								const replies = `I lack the ${formatArray(
									missing.map((item) => underline(italic(formatPermissions(item))))
								)} permission(s) to continue.`;

								return interaction.reply({ content: replies, ephemeral: true });
							}
						}
					}

					if (command.nsfw && !isNsfwChannel(interaction.channel)) {
						const replies = `This command is only accessible on ${bold('Age-Restricted')} channels.`;

						return interaction.reply({ content: replies, ephemeral: true });
					}
				}

				if (command.owner && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.reply({ content: 'This command is only accessible for developers.', ephemeral: true });
				}

				const commandName = command.group ? `${command.group}.${command.toString()}` : command.toString();
				if (!this.client.cooldowns.has(commandName)) {
					this.client.cooldowns.set(commandName, new Collection());
				}

				const now = Date.now();
				const cooldown = this.client.cooldowns.get(commandName);

				if (cooldown?.has(interaction.user.id) && !this.client.settings.owners?.includes(interaction.user.id)) {
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
					this.client.logger.error(`${(e as Error).name}: ${(e as Error).message}`, e as Error);

					const replies = [
						'An error has occured when executing this command, our developers have been informed.',
						subtext(
							`If the issue persists, please contact us in our ${hyperlink(
								'Support Server',
								hideLinkEmbed(Env.SupportServerUrl)
							)}.`
						)
					].join('\n');

					if (interaction.deferred) return interaction.editReply({ content: replies });
					return interaction.reply({ content: replies, ephemeral: true });
				}
			}
		}

		// Handle autocomplete
		if (interaction.isAutocomplete()) {
			const subCommand = interaction.options.getSubcommand(false);
			const subCommandGroup = interaction.options.getSubcommandGroup(false);

			const commandName = subCommand
				? this.client.commands.filter(
						(cmd) =>
							cmd.group ===
							(subCommandGroup ? `${interaction.commandName}.${subCommandGroup}` : interaction.commandName)
					)
				: this.client.commands;

			const command = commandName.find((cmd) => cmd.name === (subCommand ?? interaction.commandName));
			if (command) {
				if (!command.enabled) return interaction.respond([]);
				if (command.guild && !interaction.inCachedGuild()) return interaction.respond([]);
				if (command.owner && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.respond([]);
				}

				try {
					await command.autocomplete!(interaction);
				} catch (e: unknown) {
					if ((e as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
					this.client.logger.error(`${(e as Error).name}: ${(e as Error).message}`, e as Error);
				}
			}
		}
	}
}
