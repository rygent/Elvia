const Command = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'confused'],
			description: 'Someone made you confused.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const raw = await fetch(`https://anime-reactions.uzairashraf.dev/api/reactions/random?category=confused`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()} made ${interaction.user.toString()} confused.`)
			.setImage(response.reaction)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
