import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, OAuth2Scopes, PermissionFlagsBits } from 'discord-api-types/v10';
import { parseEmoji } from 'discord.js';
import { Emojis } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['invite'],
			description: 'Add the bot to another server.'
		});
	}

	async run(interaction) {
		const link = this.client.generateInvite({
			permissions: [
				PermissionFlagsBits.ManageGuild,
				PermissionFlagsBits.ManageRoles,
				PermissionFlagsBits.ManageChannels,
				PermissionFlagsBits.KickMembers,
				PermissionFlagsBits.BanMembers,
				PermissionFlagsBits.CreateInstantInvite,
				PermissionFlagsBits.ManageEmojisAndStickers,
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
			scopes: [
				OAuth2Scopes.ApplicationsCommands,
				OAuth2Scopes.Bot
			]
		});

		const replies = [
			`We greatly appreciate if you want to use ${this.client.user.username}!`,
			`Just click on the button below.`
		].join('\n');

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji(parseEmoji(Emojis.Bot))
				.setLabel('Add to Server')
				.setURL(link));

		return interaction.reply({ content: replies, components: [button], ephemeral: true });
	}

}
