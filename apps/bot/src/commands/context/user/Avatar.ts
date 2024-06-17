import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { GuildMember, UserContextMenuCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/Constants.js';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'Avatar',
			context: true
		});
	}

	public execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user') as GuildMember;

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(member.displayAvatarURL({ extension: 'png', size: 4096 }))
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
			.setDescription(`${bold(italic('ID:'))} ${inlineCode(member.user.id)}`)
			.setImage(member.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
	}
}
