import TransportStream from 'winston-transport';
import { MessageFlags, type RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';
import { ContainerBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { bold, codeBlock, heading, time } from '@discordjs/formatters';
import { fetcher } from '@/lib/fetcher.js';
import { isColorSupported } from 'colorette';
import { inspect } from 'node:util';

interface DiscordTransportOptions {
	level?: string;
	webhookUrl?: string;
}

interface LogEntry {
	level: string;
	error?: Error;
	webhook?: {
		title?: string;
		disabled?: boolean;
	};
}

export class DiscordTransport extends TransportStream {
	private readonly webhookUrl?: string;

	public constructor(options: DiscordTransportOptions) {
		super(options);
		this.level = options.level ?? 'error';
		this.webhookUrl = options.webhookUrl;
	}

	public override log(info: LogEntry, next: () => void) {
		if (this.level && this.level !== info.level) return next();
		if (!info.error) return next();
		if (info.webhook?.disabled) return next();
		if (!this.webhookUrl) return next();

		setImmediate(async () => {
			this.emit('logged', info);

			await this.send(info);
		});

		next();
	}

	private async send(info: LogEntry) {
		if (!info.error) return;

		const container = new ContainerBuilder().addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				[
					heading(info.webhook?.title ?? info.error.name, 2),
					`${codeBlock('xl', this.clean(info.error.stack))}`,
					`${bold('Message:')} ${info.error.message}`,
					`${bold('Date:')} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
				].join('\n')
			)
		);

		const body = {
			components: [container.toJSON()],
			flags: MessageFlags.IsComponentsV2
		} as RESTPostAPIWebhookWithTokenJSONBody;

		const url = new URL(this.webhookUrl!);
		url.searchParams.append('with_components', 'true');

		try {
			await fetcher(url.toString(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
		} catch (error: unknown) {
			this.emit('error', error);
		}
	}

	private clean(input: any, depth?: number) {
		if (typeof input === 'string') return input;
		const cleaned = inspect(input, { colors: isColorSupported, depth: depth ?? 2 });
		return cleaned;
	}
}
