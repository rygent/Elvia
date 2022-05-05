const MessageCommand = require('../../../Structures/Command');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'This command contain explicit content!',
			category: 'NSFW',
			cooldown: 10000,
			nsfw: true
		});
	}

	async run(message) {
		const body = await fetch('https://nekobot.xyz/api/image?type=ass');
		const response = await body.json();

		const button = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.message)]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setImage(response.message)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		return message.reply({ embeds: [embed], components: [button] });
	}

};
