const Command = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['interact', 'cry'],
			description: 'Someone made you cry.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const raw = await fetch(`https://api.waifu.pics/sfw/cry`, { method: 'GET' });
		const response = await raw.json();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member.toString()} made ${interaction.user.toString()} cry.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
