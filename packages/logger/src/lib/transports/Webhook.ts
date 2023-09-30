import TransportStream from 'winston-transport';
import type { LogCallback, LogEntry } from 'winston';
import { EmbedBuilder } from '@discordjs/builders';
import { type Client, WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { color } from '#lib/constants.js';
import { clean } from '#lib/util.js';

export class Webhook extends TransportStream {
	private readonly client: Client<true>;
	private readonly error: Error;

	public constructor(client: Client, error: Error) {
		super({ level: 'syserr' });
		this.client = client;
		this.error = error;
	}

	public override async log(info: LogEntry, callback: LogCallback) {
		const webhookUrl = process.env.LOGGER_WEBHOOK_URL;

		if (!this.client.isReady() || !webhookUrl) return;
		const webhook = new WebhookClient({ url: webhookUrl });
		const threadId = new URL(webhookUrl).searchParams.get('thread_id') as string;

		const embed = new EmbedBuilder()
			.setColor(color.red)
			.setTitle(this.error.name)
			.setDescription(
				[
					`${codeBlock('xl', clean(this.error.stack as string))}`,
					`${bold(italic('Message:'))} ${this.error.message}`,
					`${bold(italic('Date:'))} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
				].join('\n')
			)
			.setFooter({
				text: `Powered by ${this.client.user.username}`,
				iconURL: this.client.user.avatarURL() as string
			});

		const profile = {
			avatarURL: this.client.user.displayAvatarURL({ size: 4096 }),
			username: this.client.user.username
		} as WebhookMessageCreateOptions;

		await webhook.send({ embeds: [embed], threadId, ...profile });

		this.emit('logged', info);

		callback();
	}
}
