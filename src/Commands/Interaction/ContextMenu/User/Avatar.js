const Interaction = require('../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'Avatar'
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user', true);

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Open in Browser')
				.setURL(member.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })));

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
			.setDescription(`***ID:*** \`${member.user.id}\``)
			.setImage(member.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
