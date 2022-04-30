const InteractionCommand = require('../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['define'],
			description: 'Define a word.'
		});
	}

	async run(interaction) {
		const word = await interaction.options.getString('word', true);

		const body = await fetch(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`, { method: 'GET' });
		const response = await body.json().then(({ list }) => list.sort((a, b) => b.thumbs_up - a.thumbs_up)[0]);

		const button = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.permalink)]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Urban Dictionary', iconURL: 'https://i.imgur.com/qjkcwXu.png', url: 'https://urbandictionary.com/' })
			.setTitle(response.word)
			.setDescription(response.definition)
			.addFields([{ name: '__Example__', value: response.example, inline: false }])
			.setFooter({ text: `Powered by Urban Dictionary`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
