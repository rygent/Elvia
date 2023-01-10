import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import { Colors } from '../../../lib/utils/Constants.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'icon',
			description: 'Display the server icon.',
			category: 'Utility',
			guildOnly: true
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached'>) {
		if (!interaction.guild?.iconURL()) return interaction.reply({ content: 'This server has no icon.', ephemeral: true });

		const button = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(interaction.guild.iconURL({ extension: 'png', size: 4096 }) as string));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() as string })
			.setDescription(`${bold(italic('ID:'))} ${inlineCode(interaction.guild.id)}`)
			.setImage(interaction.guild.iconURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
