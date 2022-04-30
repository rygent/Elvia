const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'poke'],
			description: 'Poke someone.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const body = await fetch(`https://nekos.life/api/v2/img/poke`, { method: 'GET' });
		const response = await body.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()}, you've got a poke from ${interaction.user.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
