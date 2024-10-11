import TransportStream, { type TransportStreamOptions } from 'winston-transport';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { color } from '@/lib/constants.js';
import { clean } from '@/lib/util.js';

export interface WebhookOptions {
	url: string;
	name?: string;
	avatar?: string;
}

interface DiscordHookOptions extends TransportStreamOptions {
	error: Error;
	webhook: WebhookOptions;
}

export class DiscordHook extends TransportStream {
	protected error: Error;

	protected url: string;
	protected name?: string;
	protected avatar?: string;

	public constructor(options: DiscordHookOptions) {
		super(options);
		this.error = options.error;

		if (!options.webhook.url) {
			throw new Error('No webhook given for Discord Transport');
		}

		this.url = options.webhook.url;
		this.name = options.webhook.name;
		this.avatar = options.webhook.avatar;
	}

	public override log(info: any, next: () => void) {
		const webhook = new WebhookClient({ url: this.url });
		const threadId = new URL(this.url).searchParams.get('thread_id') as string;

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

		setImmediate(() => {
			this.emit('logged', info);

			if (this.name?.length && this.avatar?.length) {
				embed.setFooter({
					text: `Powered by ${this.name}`,
					iconURL: this.avatar
				});

				const profile = {
					avatarURL: this.avatar,
					username: this.name
				} as WebhookMessageCreateOptions;

				return webhook.send({ embeds: [embed], threadId, ...profile });
			}

			return webhook.send({ embeds: [embed], threadId });
		});

		next();
	}
}
