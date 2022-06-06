const InteractionCommand = require('../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors, Secrets } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['image', 'food'],
			description: 'Sends Food images from Imgur.'
		});
	}

	async run(interaction) {
		const headers = { Authorization: `Client-ID ${Secrets.ImgurClientId}` };
		const body = await fetch('https://api.imgur.com/3/gallery/r/food', { method: 'GET', headers });
		const response = await body.json().then(({ data }) => data[Math.floor(Math.random() * data.length)]);

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.link));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Imgur', iconURL: 'https://i.imgur.com/ieOOJSw.png', url: 'https://imgur.com/' })
			.setTitle(response.title)
			.setImage(response.link)
			.setFooter({ text: 'Powered by Imgur', iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
