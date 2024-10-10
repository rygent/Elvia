import TransportStream, { type TransportStreamOptions } from 'winston-transport';
import { EmbedBuilder } from '@discordjs/builders';
import { type Client, WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { color } from '@/lib/constants.js';
import { clean } from '@/lib/util.js';

interface DiscordTransportOptions extends TransportStreamOptions {
	client?: Client;
	error: Error;
	webhook?: string;
	interval?: number;
}

export class Discord extends TransportStream {
	private readonly client: Client | undefined;

	private readonly error: Error;
	private readonly webhook: string;

	public constructor(options: DiscordTransportOptions) {
		super(options);
		if (options.client) {
			this.client = options.client;
		}

		this.error = options.error;

		if (!options.webhook) {
			if (!process.env.LOGGER_WEBHOOK_URL) {
				throw new Error('No webhook given for Discord Transport');
			}

			options.webhook = process.env.LOGGER_WEBHOOK_URL;
		}

		this.webhook = options.webhook;
	}

	public override log(info: any, next: () => void) {
		setImmediate(() => {
			this.emit('logged', info);

			const webhook = new WebhookClient({ url: this.webhook });
			const threadId = new URL(this.webhook).searchParams.get('thread_id') as string;

			const embed = new EmbedBuilder()
				.setColor(color.red)
				.setTitle(this.error.name)
				.setDescription(
					[
						`${codeBlock('xl', clean(this.error.stack as string))}`,
						`${bold(italic('Message:'))} ${this.error.message}`,
						`${bold(italic('Date:'))} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
					].join('\n')
				);

			if (this.client?.isReady()) {
				embed.setFooter({
					text: `Powered by ${this.client.user.username}`,
					iconURL: this.client.user.avatarURL() as string
				});

				const profile = {
					avatarURL: this.client.user.displayAvatarURL({ size: 4096 }),
					username: this.client.user.username
				} as WebhookMessageCreateOptions;

				return webhook.send({ embeds: [embed], threadId, ...profile });
			}

			return webhook.send({ embeds: [embed], threadId });
		});

		next();
	}
}
