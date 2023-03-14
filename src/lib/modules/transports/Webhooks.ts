import type BaseClient from '../../BaseClient.js';
import TransportStream from 'winston-transport';
import type { LogCallback, LogEntry } from 'winston';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { Colors, Links } from '../../utils/Constants.js';
import { isColorSupported } from 'colorette';
import { inspect } from 'node:util';

export class Webhook extends TransportStream {
	private readonly client: BaseClient<true>;
	private readonly error: Error;

	public constructor(client: BaseClient, error: Error) {
		super({ level: 'syserr' });
		this.client = client;
		this.error = error;
	}

	public override async log(info: LogEntry, callback: LogCallback) {
		if (!this.client.isReady()) return;
		const webhook = new WebhookClient({ url: Links.LoggerWebhook });
		const threadId = new URL(Links.LoggerWebhook).searchParams.get('thread_id') as string;

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(this.error.name)
			.setDescription([
				`${codeBlock('xl', clean(this.error.stack as string))}`,
				`${bold(italic('Message:'))} ${this.error.message}`,
				`${bold(italic('Date:'))} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() as string });

		const profile = {
			avatarURL: this.client.user?.displayAvatarURL({ size: 4096 }),
			username: this.client.user?.username
		} as WebhookMessageCreateOptions;

		await webhook.send({ embeds: [embed], threadId, ...profile });

		this.emit('logged', info);

		callback();
	}
}

function clean(input: unknown, depth?: number) {
	if (typeof input === 'string') return input;
	const cleaned = inspect(input, { colors: isColorSupported, depth: depth });
	return cleaned;
}
