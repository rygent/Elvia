const InteractionCommand = require('../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors, Secrets } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['image', 'art'],
			description: 'Sends Art images from Imgur.'
		});
	}

	async run(interaction) {
		const categories = ['art', 'artporn', 'drawing', 'deviantart', 'illustration', 'streetart', 'pixelart'];
		const subreddit = categories[Math.floor(Math.random() * categories.length)];
		await interaction.deferReply();

		const headers = { Authorization: `Client-ID ${Secrets.ImgurClientId}` };
		const body = await fetch(`https://api.imgur.com/3/gallery/r/${subreddit}`, { method: 'GET', headers });
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

		return interaction.editReply({ embeds: [embed], components: [button] });
	}

};
