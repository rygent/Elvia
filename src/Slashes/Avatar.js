const Slash = require('../Structures/Slash.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../Utils/Configuration.js');

module.exports = class extends Slash {

	constructor(...args) {
		super(...args, {
			description: 'Gets user avatar',
			options: [{
				type: 'USER',
				name: 'user',
				description: 'User to fetch avatar'
			}]
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user') || interaction.user;

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Download')
				.setURL(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })));

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription(`\`ID: ${user.id}\``)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`Responded in ${this.client.utils.responseTime(interaction)}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
