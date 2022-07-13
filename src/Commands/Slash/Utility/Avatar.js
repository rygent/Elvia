import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import Command from '../../../Structures/Interaction.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['avatar'],
			description: 'Display the avatar of the provided user.'
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.displayAvatarURL({ extension: 'png', size: 4096 })));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription(`***ID:*** \`${user.id}\``)
			.setImage(user.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
