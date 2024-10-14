import build from 'pino-abstract-transport';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient } from 'discord.js';
import { bold, codeBlock, italic, time } from '@discordjs/formatters';
import { isColorSupported } from 'colorette';
import { inspect } from 'node:util';

interface DiscordOptions {
	url?: string;
}

function clean(input: any, depth?: number) {
	if (typeof input === 'string') return input;
	const cleaned = inspect(input, { colors: isColorSupported, depth: depth ?? 2 });
	return cleaned;
}

export function discord(options: DiscordOptions) {
	return build((source) => {
		if (options.url) {
			void source.forEach((log) => {
				if (typeof log.err !== 'undefined') {
					const webhook = new WebhookClient({ url: options.url! });
					const threadId = new URL(options.url!).searchParams.get('thread_id')!;

					const embed = new EmbedBuilder()
						.setTitle(log.err.type)
						.setDescription(
							[
								`${codeBlock('xl', clean(log.err.stack))}`,
								`${bold(italic('Message:'))} ${log.err.message}`,
								`${bold(italic('Date:'))} ${time(new Date(log.time), 'D')} (${time(new Date(log.time), 'R')})`
							].join('\n')
						);

					void webhook.send({ embeds: [embed], threadId });
				}
			});
		}
	});
}
