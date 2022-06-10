const InteractionCommand = require('../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['meme', 'random'],
			description: 'Displays random memes.'
		});
	}

	async run(interaction) {
		const body = await fetch('https://apis.duncte123.me/meme', { method: 'GET' });
		const response = await body.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setImage(response.data.image)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
