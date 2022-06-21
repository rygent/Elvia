const Command = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'hug'],
			description: 'Hug someone'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const raw = await fetch(`https://nekos.life/api/v2/img/hug`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()}, you've got a hug from ${interaction.user.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
