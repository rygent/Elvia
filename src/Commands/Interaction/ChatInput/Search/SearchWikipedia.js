const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'wikipedia',
			description: 'Search for something on Wikipedia.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
			const result = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`, { headers }).then(res => res.data);

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(result.content_urls.desktop.page));

			const embed = new MessageEmbed()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/a4eeEhh.png', url: 'https://en.wikipedia.org/' })
				.setTitle(result.title)
				.setThumbnail(result.originalimage?.source)
				.setDescription(result.extract)
				.setFooter({ text: `Powered by Wikipedia`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed], components: [button] });
		} catch (error) {
			if (error.response.status === 404) {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
