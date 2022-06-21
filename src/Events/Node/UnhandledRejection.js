const Event = require('../../Structures/Event');
const { EmbedBuilder } = require('@discordjs/builders');
const { WebhookClient, codeBlock, time } = require('discord.js');
const { Colors, Links } = require('../../Utils/Constants');
const process = require('node:process');

module.exports = class extends Event {

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
		const webhook = new WebhookClient({ url: Links.LoggerWebhook });

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle('Unhandled Rejection')
			.setDescription([
				`${codeBlock('ts', this.clean(error.stack, { depth: 2 }))}`,
				`***Name:*** ${error.name}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ size: 4096 }) });
	}

};
