import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { DiscordAPIError } from '@discordjs/rest';
import { WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { Colors } from '#lib/utils/Constants.js';
import { Env } from '#lib/utils/Env.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	// @ts-expect-error
	public run(error: Error, promise: Promise<unknown>) {
		if ((error as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
		this.client.logger.error(`${error.name}: ${error.message}`, error, false);

		if (this.client.isReady() && Env.LoggerWebhookUrl) {
			const webhook = new WebhookClient({ url: Env.LoggerWebhookUrl });
			const threadId = new URL(Env.LoggerWebhookUrl).searchParams.get('thread_id') as string;

			const embed = new EmbedBuilder()
				.setColor(Colors.Red)
				.setTitle('Unhandled Rejection')
				.setDescription(
					[
						`${codeBlock('xl', error.stack as string)}`,
						`${bold(italic('Name:'))} ${error.name}`,
						`${bold(italic('Message:'))} ${error.message}`,
						`${bold(italic('Date:'))} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
					].join('\n')
				)
				.setFooter({
					text: `Powered by ${this.client.user.username}`,
					iconURL: this.client.user.avatarURL() as string
				});

			const profile = {
				avatarURL: this.client.user?.displayAvatarURL({ size: 4096 }),
				username: this.client.user?.username
			} as WebhookMessageCreateOptions;

			return webhook.send({ embeds: [embed], threadId, ...profile });
		}
	}
}
