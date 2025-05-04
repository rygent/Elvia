import TransportStream from 'winston-transport';
import { ContainerBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { MessageFlags, WebhookClient } from 'discord.js';
import { bold, codeBlock, heading, time } from '@discordjs/formatters';
import { isColorSupported } from 'colorette';
import { inspect } from 'node:util';

interface DiscordOptions {
	webhookUrl: string;
	level?: string;
	unique?: boolean;
}

export class Discord extends TransportStream {
	private readonly webhookUrl: string;

	private readonly unique?: boolean;

	public constructor(options: DiscordOptions) {
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

		const container = new ContainerBuilder().addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				[
					heading(error.name, 2),
					`${codeBlock('xl', this.clean(error.stack))}`,
					`${bold('Message:')} ${error.message}`,
					`${bold('Date:')} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
				].join('\n')
			)
		);

		try {
			await webhook.send({
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
				withComponents: true,
				threadId
			});
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
