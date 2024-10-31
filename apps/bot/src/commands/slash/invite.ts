import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	type APIMessageComponentEmoji,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType,
	OAuth2Scopes,
	PermissionFlagsBits
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, parseEmoji } from 'discord.js';
import { Emojis } from '@/lib/utils/constants.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'invite',
			description: 'Add the bot to another server.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'General'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const link = this.client.generateInvite({
			permissions: [
				PermissionFlagsBits.ManageGuild,
				PermissionFlagsBits.ManageRoles,
				PermissionFlagsBits.ManageChannels,
				PermissionFlagsBits.KickMembers,
				PermissionFlagsBits.BanMembers,
				PermissionFlagsBits.CreateInstantInvite,
				PermissionFlagsBits.ManageGuildExpressions,
				PermissionFlagsBits.ViewChannel,
				PermissionFlagsBits.ModerateMembers,
				PermissionFlagsBits.SendMessages,
				PermissionFlagsBits.SendMessagesInThreads,
				PermissionFlagsBits.ManageMessages,
				PermissionFlagsBits.EmbedLinks,
				PermissionFlagsBits.AttachFiles,
				PermissionFlagsBits.ReadMessageHistory,
				PermissionFlagsBits.UseExternalEmojis,
				PermissionFlagsBits.AddReactions
			],
			scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot]
		});

		const replies = [
			`We greatly appreciate if you want to use ${this.client.user.username}!`,
			`Just click on the button below.`
		].join('\n');

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji(parseEmoji(Emojis.Bot) as APIMessageComponentEmoji)
				.setLabel('Add to Server')
				.setURL(link)
		);

		return interaction.reply({ content: replies, components: [button], ephemeral: true });
	}
}
