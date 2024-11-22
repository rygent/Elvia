import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { GuildMember, UserContextMenuCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import type { Internationalization } from '@elvia/i18next';
import { Colors } from '@/lib/utils/constants.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.User,
			name: 'Avatar',
			description: '',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild]
		});
	}

	public execute(interaction: UserContextMenuCommandInteraction<'cached'>, i18n: Internationalization) {
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
			.setFooter({
				text: i18n.text('common:powered_by', { service: this.client.user.username }),
				iconURL: interaction.user.avatarURL() as string
			});

		return interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
	}
}
