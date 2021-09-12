const Interaction = require('../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			description: 'Gets user avatar',
			options: [
				{ type: 'USER', name: 'user', description: 'User to fetch avatar' }
			]
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user') || interaction.user;

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription([
				`\`ID: ${user.id}\``,
				`[Click here to download](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`
			].join('\n'))
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`${interaction.user.username}  •  Powered by ${this.client.user.username}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
