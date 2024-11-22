import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import { type BaseInteraction, Events, type GuildMember } from 'discord.js';
import { Collection } from '@discordjs/collection';
import type { DiscordAPIError } from '@discordjs/rest';
import { prisma } from '@elvia/database';
import { logger } from '@elvia/logger';
import { bold, italic, underline } from '@discordjs/formatters';
import { formatArray, formatPermissions, getCommandName, isNsfwChannel } from '@/lib/utils/functions.js';
import { env } from '@/env.js';

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
			const commandName = getCommandName(interaction);
			const command = this.client.commands.get(commandName);

			// eslint-disable-next-line prefer-destructuring
			let i18n = this.client.i18n;

			if (interaction.inCachedGuild()) {
				const database = await prisma.guild.findFirst({
					where: { id: interaction.guildId },
					select: { locale: true }
				});

				i18n = this.client.i18n.setLocale(database?.locale ?? interaction.guildLocale);
			}

			if (command) {
				if (!command.enabled) {
					return interaction.reply({ content: i18n.text('misc:command_disabled'), ephemeral: true });
				}

				if (command.unsafe && !this.client.settings.unsafeMode) {
					return interaction.reply({ content: 'This command is currently under development.', ephemeral: true });
				}

				if (command.guild && !interaction.inCachedGuild()) {
					return interaction.reply({ content: i18n.text('misc:guild_only'), ephemeral: true });
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
								const replies = i18n.text('misc:missing_user_permission', {
									permission: formatArray(missing.map((item) => underline(italic(formatPermissions(item)))))
								});

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
								const replies = i18n.text('misc:missing_client_permission', {
									permission: formatArray(missing.map((item) => underline(italic(formatPermissions(item)))))
								});

								return interaction.reply({ content: replies, ephemeral: true });
							}
						}
					}

					if (command.nsfw && !isNsfwChannel(interaction.channel)) {
						return interaction.reply({ content: i18n.text('misc:nsfw_command'), ephemeral: true });
					}
				}

				if (command.owner && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.reply({ content: i18n.text('misc:owner_only'), ephemeral: true });
				}

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
							.reply({ content: i18n.text('misc:cooldown', { duration: bold(duration.toFixed(2)) }), ephemeral: true })
							.then(() => setTimeout(() => interaction.deleteReply(), expired - now));
					}
				}

				cooldown?.set(interaction.user.id, now);
				setTimeout(() => cooldown?.delete(interaction.user.id), command.cooldown);

				try {
					await command.execute(interaction, i18n);
				} catch (e: unknown) {
					if ((e as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
					if (interaction.replied) return;
					logger.error(`${(e as Error).name}: ${(e as Error).message}`, { error: e as Error });

					const replies = i18n.text('misc:error_occurred', { invite: env.SUPPORT_SERVER_URL });

					if (interaction.deferred) return interaction.editReply({ content: replies });
					return interaction.reply({ content: replies, ephemeral: true });
				}
			}
		}

		// Handle autocomplete
		if (interaction.isAutocomplete()) {
			const commandName = getCommandName(interaction);
			const command = this.client.commands.get(commandName);

			if (command) {
				if (!command.enabled) return interaction.respond([]);
				if (command.unsafe && !this.client.settings.unsafeMode) return interaction.respond([]);
				if (command.guild && !interaction.inCachedGuild()) return interaction.respond([]);
				if (command.owner && !this.client.settings.owners?.includes(interaction.user.id)) {
					return interaction.respond([]);
				}

				try {
					await command.autocomplete!(interaction);
				} catch (e: unknown) {
					if ((e as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
					logger.error(`${(e as Error).name}: ${(e as Error).message}`, { error: e as Error });
				}
			}
		}
	}
}
