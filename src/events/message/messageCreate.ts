import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';
import { Collection } from '@discordjs/collection';
import type { GuildMember, Message } from 'discord.js';
import { bold, italic, underscore } from '@discordjs/formatters';
import { formatArray, formatPermissions, isNsfwChannel } from '#lib/utils/Function.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'messageCreate',
			once: false
		});
	}

	public async run(message: Message<true>) {
		if (message.author.bot || !message.inGuild()) return;

		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		const prefix = message.content.match(mentionRegexPrefix)
			? message.content.match(mentionRegexPrefix)![0]
			: this.client.prefix;

		if (!message.content.startsWith(prefix as string)) return;

		const [cmd, ...args] = message.content.slice(prefix?.length).trim().split(/ +/g);

		const command =
			this.client.commands.get(cmd!.toLowerCase()) ??
			this.client.commands.get(this.client.aliases.get(cmd!.toLowerCase()) as string);

		if (command) {
			if (command.disabled && !this.client.owners?.includes(message.author.id)) return;

			if (message.inGuild()) {
				const memberPermCheck = command.memberPermissions
					? this.client.defaultPermissions.add(command.memberPermissions)
					: this.client.defaultPermissions;

				if (memberPermCheck) {
					const missing = message.channel
						.permissionsFor(message.member as GuildMember)
						.missing(memberPermCheck) as string[];

					if (missing.length) {
						const replies = `You lack the ${formatArray(
							missing.map((item) => underscore(italic(formatPermissions(item))))
						)} permission(s) to continue.`;

						return message.reply({ content: replies });
					}
				}

				const clientPermCheck = command.clientPermissions
					? this.client.defaultPermissions.add(command.clientPermissions)
					: this.client.defaultPermissions;

				if (clientPermCheck) {
					const missing = message.channel
						.permissionsFor(message.guild.members.me as GuildMember)
						.missing(clientPermCheck) as string[];

					if (missing.length) {
						const replies = `I lack the ${formatArray(
							missing.map((item) => underscore(italic(formatPermissions(item))))
						)} permission(s) to continue.`;

						return message.reply({ content: replies });
					}
				}

				if (command.nsfw && !isNsfwChannel(message.channel)) return;
			}

			if (command.ownerOnly && !this.client.owners?.includes(message.author.id)) return;

			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const cooldown = this.client.cooldowns.get(command.name);

			if (cooldown?.has(message.author.id) && !this.client.owners?.includes(message.author.id)) {
				const expired = (cooldown.get(message.author.id) as number) + command.cooldown;

				if (now < expired) {
					const duration = (expired - now) / 1e3;
					return message
						.reply({ content: `You've to wait ${bold(duration.toFixed(2))} second(s) to continue.` })
						.then((m) => setTimeout(() => m.delete(), expired - now));
				}
			}

			cooldown?.set(message.author.id, now);
			setTimeout(() => cooldown?.delete(message.author.id), command.cooldown);

			try {
				await message.channel.sendTyping();
				await command.execute(message, args);
			} catch (e: unknown) {
				this.client.logger.error(`${(e as Error).name}: ${(e as Error).message}`, e as Error, true);

				const replies = [
					'An error has occured when executing this command, our developers have been informed.',
					'If the issue persists, please contact us in our Support Server.'
				].join('\n');

				return message.reply({ content: replies });
			}
		}
	}
}
