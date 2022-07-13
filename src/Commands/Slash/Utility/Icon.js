import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['icon'],
			description: 'Display the server icon.'
		});
	}

	async run(interaction) {
		if (!interaction.guild.iconURL()) return interaction.reply({ content: 'This server has no icon.', ephemeral: true });

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(interaction.guild.iconURL({ extension: 'png', size: 4096 })));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setDescription(`***ID:*** \`${interaction.guild.id}\``)
			.setImage(interaction.guild.iconURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
