const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'confused'],
			description: 'Someone made you confused.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const response = await axios.get(`https://anime-reactions.uzairashraf.dev/api/reactions/random?category=confused`).then(({ data }) => data);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()} made ${interaction.user.toString()} confused.`)
			.setImage(response.reaction)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
