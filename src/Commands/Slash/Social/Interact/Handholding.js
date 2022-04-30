const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'handholding'],
			description: 'Hold the hand of someone.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const response = await axios.get(`https://api.waifu.pics/sfw/handhold`).then(({ data }) => data);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${interaction.user.toString()} holds the hand of ${member.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
