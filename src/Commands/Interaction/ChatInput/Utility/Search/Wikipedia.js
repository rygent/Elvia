const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors } = require('../../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'wikipedia'],
			description: 'Search for something on Wikipedia.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`).then(({ data }) => data);

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(response.content_urls.desktop.page));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/a4eeEhh.png', url: 'https://en.wikipedia.org/' })
				.setTitle(response.title)
				.setThumbnail(response.originalimage?.source)
				.setDescription(response.extract)
				.setFooter({ text: `Powered by Wikipedia`, iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed], components: [button] });
		} catch (error) {
			if (error.response.status === 404) {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
