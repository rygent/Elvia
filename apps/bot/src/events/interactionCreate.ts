import { CoreEvent, type CoreClient } from '@elvia/core';
import { MessageFlags } from 'discord-api-types/v10';
import { Events, type BaseInteraction } from 'discord.js';
import { Collection } from '@discordjs/collection';
import { logger } from '@elvia/logger';
import { bold, hideLinkEmbed, hyperlink, italic, underline, subtext } from '@discordjs/formatters';
import { formatArray, formatPermissions, isNsfwChannel } from '@/lib/utils/functions.js';
import { env } from '@/env.js';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.InteractionCreate,
			once: false
		});
	}

	// eslint-disable-next-line complexity
	public async run(interaction: BaseInteraction<'cached' | 'raw'>) {
		// Handle slash & context menu commands
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			// eslint-disable-next-line prefer-destructuring
			let commandName = interaction.commandName;

			if (interaction.isChatInputCommand()) {
				const subCommandGroup = interaction.options.getSubcommandGroup(false);
				const subCommand = interaction.options.getSubcommand(false);

				commandName = [interaction.commandName, subCommandGroup, subCommand].filter(Boolean).join(' ');
			}

			const command = this.client.commands.get(commandName);
			const context = this.client.contexts.get(commandName);

			const commandOrContext = command ?? context;

			if (commandOrContext) {
				if (!commandOrContext.enabled) {
					return interaction.reply({
						content: 'This command is currently inaccessible.',
						flags: MessageFlags.Ephemeral
					});
				}

				if (commandOrContext.guildOnly && !interaction.inCachedGuild()) {
					return interaction.reply({
						content: 'This command cannot be used out of a server.',
						flags: MessageFlags.Ephemeral
					});
				}

				if (interaction.inGuild()) {
					if (interaction.inCachedGuild()) {
						const memberPermsCheck = commandOrContext.memberPermissions
							? this.client.defaultPermissions.add(commandOrContext.memberPermissions)
							: this.client.defaultPermissions;

						if (memberPermsCheck) {
							const missing = interaction.channel?.permissionsFor(interaction.member)?.missing(memberPermsCheck);

							// eslint-disable-next-line max-depth
							if (missing?.length) {
								const replies = `You lack the ${formatArray(
									missing?.map((item) => underline(italic(formatPermissions(item))))
								)} permission(s) to continue.`;

								return interaction.reply({ content: replies, flags: MessageFlags.Ephemeral });
							}
						}

						const clientPermsCheck = commandOrContext.clientPermissions
							? this.client.defaultPermissions.add(commandOrContext.clientPermissions)
							: this.client.defaultPermissions;

						if (clientPermsCheck) {
							const missing = interaction.channel
								?.permissionsFor(interaction.guild.members.me!)
								?.missing(clientPermsCheck);

							// eslint-disable-next-line max-depth
							if (missing?.length) {
								const replies = `I lack the ${formatArray(
									missing?.map((item) => underline(italic(formatPermissions(item))))
								)} permission(s) to continue.`;

								return interaction.reply({ content: replies, flags: MessageFlags.Ephemeral });
							}
						}
					}

					if (commandOrContext.nsfw && !isNsfwChannel(interaction.channel)) {
						const replies = `This command is only accessible on ${bold('Age-Restricted')} channels.`;

						return interaction.reply({ content: replies, flags: MessageFlags.Ephemeral });
					}
				}

				if (commandOrContext.ownerOnly && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.reply({
						content: 'This command is only accessible for developers.',
						flags: MessageFlags.Ephemeral
					});
				}

				if (!this.client.cooldowns.has(commandName)) {
					this.client.cooldowns.set(commandName, new Collection());
				}

				const now = Date.now();
				const cooldown = this.client.cooldowns.get(commandName);

				if (cooldown?.has(interaction.user.id) && !this.client.settings.owners?.includes(interaction.user.id)) {
					const expired = (cooldown.get(interaction.user.id) as number) + commandOrContext.cooldown;

					if (now < expired) {
						const duration = (expired - now) / 1e3;
						return interaction
							.reply({
								content: `You've to wait ${bold(duration.toFixed(2))} second(s) to continue.`,
								flags: MessageFlags.Ephemeral
							})
							.then(() => setTimeout(() => interaction.deleteReply(), expired - now));
					}
				}

				cooldown?.set(interaction.user.id, now);
				setTimeout(() => cooldown?.delete(interaction.user.id), commandOrContext.cooldown);

				try {
					if (command && interaction.isChatInputCommand()) {
						await command.execute(interaction);
					} else if (context && interaction.isContextMenuCommand()) {
						await context.execute(interaction);
					}
				} catch (error: unknown) {
					if (error instanceof Error) {
						if (error.name === 'DiscordAPIError[10062]') return;
						logger.error(`${error.name}: ${error.message}`, { error });
					}

					const replies = [
						'An error has occured when executing this command.',
						subtext(`please contact us in our ${hyperlink('Support Server', hideLinkEmbed(env.SUPPORT_SERVER_URL))}.`)
					].join('\n');

					if (interaction.deferred) return interaction.editReply({ content: replies });
					if (interaction.replied) return interaction.followUp({ content: replies, flags: MessageFlags.Ephemeral });
					return interaction.reply({ content: replies, flags: MessageFlags.Ephemeral });
				}
			}
		}

		// Handle autocomplete
		if (interaction.isAutocomplete()) {
			const subCommandGroup = interaction.options.getSubcommandGroup(false);
			const subCommand = interaction.options.getSubcommand(false);

			const commandName = [interaction.commandName, subCommandGroup, subCommand].filter(Boolean).join(' ');
			const command = this.client.commands.get(commandName);

			if (command) {
				if (!command.enabled) return interaction.respond([]);
				if (command.guildOnly && !interaction.inCachedGuild()) return interaction.respond([]);
				if (command.ownerOnly && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.respond([]);
				}

				try {
					await command.autocomplete(interaction);
				} catch (error: unknown) {
					if (error instanceof Error) {
						if (error.name === 'DiscordAPIError[10062]') return interaction.respond([]);
						logger.error(`${error.name}: ${error.message}`, { error });
					}
				}
			}
		}
	}
}
