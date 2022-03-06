const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'define',
			description: 'Define a word.'
		});
	}

	async run(interaction) {
		const word = await interaction.options.getString('word', true);

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`, { headers }).then(res => res.data.list.sort((a, b) => b.thumbs_up - a.thumbs_up)[0]);

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(result.permalink));

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Urban Dictionary', iconURL: 'https://i.imgur.com/qjkcwXu.png', url: 'https://www.urbandictionary.com/' })
			.setTitle(result.word)
			.setDescription(result.definition)
			.addField('__Example__', result.example)
			.setFooter({ text: `Powered by Urban Dictionary`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
