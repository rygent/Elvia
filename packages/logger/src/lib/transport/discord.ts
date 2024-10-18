import TransportStream from 'winston-transport';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { isColorSupported } from 'colorette';
import { inspect } from 'node:util';

interface WinstonDiscordOptions {
	webhookUrl: string;
	level?: string;
	unique?: boolean;
}

export class WinstonDiscord extends TransportStream {
	private readonly webhookUrl: string;

	private readonly unique?: boolean;

	public constructor(options: WinstonDiscordOptions) {
		super(options);
		this.webhookUrl = options.webhookUrl;
		if (!this.webhookUrl) throw new Error('options.webhookUrl is required.');

		this.level = options.level ?? 'error';
		this.unique = options.unique ?? false;
	}

	public override log(info: any, next: () => void) {
		if (this.unique && this.level !== info.level) return next();
		if (typeof info.error === 'undefined') return next();
		if (typeof info.webhook === 'boolean' && !info.webhook) return next();

		setImmediate(() => {
			this.emit('logged', info);

			void this.send(info);
		});

		next();
	}

	private async send(info: any) {
		const { error } = info;

		const webhook = new WebhookClient({ url: this.webhookUrl });
		const threadId = new URL(this.webhookUrl).searchParams.get('thread_id')!;

		const embed = new EmbedBuilder()
			.setColor(0xe13f4d)
			.setTitle(error.name)
			.setDescription(
				[
					`${codeBlock('xl', this.clean(error.stack))}`,
					`${bold(italic('Message:'))} ${error.message}`,
					`${bold(italic('Date:'))} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
				].join('\n')
			);

		try {
			await webhook.send({ embeds: [embed], threadId });
		} catch (err) {
			this.emit('error', err);
		}
	}

	private clean(input: any, depth?: number) {
		if (typeof input === 'string') return input;
		const cleaned = inspect(input, { colors: isColorSupported, depth: depth ?? 2 });
		return cleaned;
	}
}
