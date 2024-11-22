import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import type { Internationalization } from '@elvia/i18next';
import { Colors } from '@/lib/utils/constants.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'avatar',
			description: 'Display the avatar of the provided user.',
			options: [
				{
					name: 'user',
					description: 'User to display.',
					type: ApplicationCommandOptionType.User,
					required: false
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>, i18n: Internationalization) {
		const user = interaction.options.getUser('user') ?? interaction.user;

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.displayAvatarURL({ extension: 'png', size: 4096 }))
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setDescription(`${bold(italic('ID:'))} ${inlineCode(user.id)}`)
			.setImage(user.displayAvatarURL({ size: 512 }))
			.setFooter({
				text: i18n.text('common:powered_by', { service: this.client.user.username }),
				iconURL: interaction.user.avatarURL() as string
			});

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
