const Interaction = require('../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'icon',
			description: 'Display the server icon.'
		});
	}

	async run(interaction) {
		if (!interaction.guild.iconURL()) return interaction.reply({ content: 'This server has no icon.', ephemeral: true });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Open in Browser')
				.setURL(interaction.guild.iconURL({ format: 'png', dynamic: true, size: 4096 })));

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
			.setDescription(`***ID:*** \`${interaction.guild.id}\``)
			.setImage(interaction.guild.iconURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
