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
		this.client.logger.error(error.stack);

		if (!this.client.isReady() || !Links.LoggerWebhook) return;
		const webhook = new WebhookClient(parseWebhookURL(Links.LoggerWebhook));

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Unhandled Rejection')
			.setDescription([
				`${codeBlock('ts', error.stack)}`,
				`***Name:*** ${error.name}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username });
	}

}
