const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');

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
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(interaction.guild.iconURL({ format: 'png', dynamic: true, size: 4096 })));

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
			.setDescription(`***ID:*** \`${interaction.guild.id}\``)
			.setImage(interaction.guild.iconURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
