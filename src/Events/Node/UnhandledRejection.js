import Event from '../../Structures/Event.js';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, codeBlock, parseWebhookURL, time } from 'discord.js';
import { Colors, Links } from '../../Utils/Constants.js';
import process from 'node:process';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'unhandledRejection',
			once: false,
			emitter: process
		});
	}

	async run(error, promise) { // eslint-disable-line no-unused-vars
		if (error.name === 'DiscordAPIError[10062]') return;
		this.client.logger.error(`${error.name}: ${error.message}`, error, false);

		if (!this.client.isReady()) return;
		if (!Links.LoggerWebhook) return;
		const webhook = new WebhookClient(parseWebhookURL(Links.LoggerWebhook));
		const threadId = new URL(Links.LoggerWebhook).searchParams.get('thread_id');

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Unhandled Rejection')
			.setDescription([
				`${codeBlock('xl', error.stack)}`,
				`***Name:*** ${error.name}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username, threadId });
	}

}
