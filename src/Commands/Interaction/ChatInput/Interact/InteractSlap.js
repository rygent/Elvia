const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: 'interact',
			subCommand: 'slap',
			description: 'Slap someone.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const response = await axios.get(`https://nekos.life/api/v2/img/slap`).then(({ data }) => data);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()}, you've got a slap from ${interaction.user.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
