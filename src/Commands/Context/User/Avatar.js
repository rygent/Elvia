import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['Avatar']
		});
	}

	async run(interaction) {
		const member = interaction.options.getMember('user');

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(member.displayAvatarURL({ extension: 'png', size: 4096 })));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
			.setDescription(`***ID:*** \`${member.user.id}\``)
			.setImage(member.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
	}

}
