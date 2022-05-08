const InteractionCommand = require('../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['image', 'art'],
			description: 'Sends Art images from Imgur.'
		});
	}

	async run(interaction) {
		const body = await fetch('https://imgur.com/r/art/hot.json', { method: 'GET' });
		const response = await body.json().then(({ data }) => data[Math.floor(Math.random() * data.length)]);

		const button = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`https://i.imgur.com/${response.hash}${response.ext}`)]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Imgur', iconURL: 'https://i.imgur.com/ieOOJSw.png', url: 'https://imgur.com/' })
			.setTitle(response.title)
			.setImage(`https://i.imgur.com/${response.hash}${response.ext}`)
			.setFooter({ text: 'Powered by Imgur', iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
