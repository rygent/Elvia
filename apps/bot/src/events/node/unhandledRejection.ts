import { CoreClient, CoreEvent } from '@elvia/core';
import { MessageFlags } from 'discord-api-types/v10';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, codeBlock, heading, subtext, time } from '@discordjs/formatters';
import { type DiscordAPIError } from '@discordjs/rest';
import { env } from '@/env.js';
import { logger } from '@elvia/logger';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	// @ts-expect-error TS6133: 'promise' is declared but its value is never read.
	public run(error: Error, promise: Promise<unknown>) {
		if ((error as DiscordAPIError).name === 'DiscordAPIError[10062]') return;
		logger.fatal(`${error.name}: ${error.message}`, { error });

		if (this.client.isReady() && env.LOGGER_WEBHOOK_URL) {
			const webhook = new WebhookClient({ url: env.LOGGER_WEBHOOK_URL });
			const threadId = new URL(env.LOGGER_WEBHOOK_URL).searchParams.get('thread_id') as string;

			const container = new ContainerBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							heading('Unhandled Rejection', 2),
							`${codeBlock('xl', error.stack as string)}`,
							`${bold('Name:')} ${error.name}`,
							`${bold('Message:')} ${error.message}`,
							`${bold('Date:')} ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
						].join('\n')
					)
				)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
				);

			const profile = {
				avatarURL: this.client.user?.displayAvatarURL({ size: 4096 }),
				username: this.client.user?.username
			} as WebhookMessageCreateOptions;

			return webhook.send({
				components: [container],
				flags: [MessageFlags.IsComponentsV2],
				withComponents: true,
				threadId,
				...profile
			});
		}
	}
}
