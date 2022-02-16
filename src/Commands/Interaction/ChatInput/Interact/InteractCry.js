const Interaction = require('../../../../Structures/Interaction');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'interact',
			subCommand: 'cry',
			description: 'Someone made you cry.'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user', true);

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://api.waifu.pics/sfw/cry`, { headers }).then(res => res.data);

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setDescription(`**${member.user.username}** made **${interaction.user.username}** cry.`)
			.setImage(result.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed] });
	}

};
