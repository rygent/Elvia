const Interaction = require('../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			description: 'Showing avatar of the mentioned user',
			options: [{
				name: 'user',
				type: 'USER',
				description: 'User to fetch avatar',
				required: false
			}]
		});
	}

	async run(interaction, [target]) {
		const user = await this.client.resolveUser(target) || interaction.user;

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription([
				`\`ID: ${user.id}\``,
				`[Click here to download](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`
			].join('\n'))
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`Responded in ${this.client.utils.responseTime(interaction)}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
