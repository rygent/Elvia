import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { PermissionsBitField, type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'softban',
			description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
			options: [
				{
					name: 'user',
					description: 'User to softban.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'reason',
					description: 'Reason of the softban.',
					type: ApplicationCommandOptionType.String,
					max_length: 500,
					required: false
				},
				{
					name: 'days',
					description: 'Number of days to delete messages for.',
					type: ApplicationCommandOptionType.Integer,
					choices: [
						{
							name: '0 days. (default)',
							value: 0
						},
						{
							name: '1 day.',
							value: 1
						},
						{
							name: '2 days.',
							value: 2
						},
						{
							name: '3 days.',
							value: 3
						},
						{
							name: '4 days.',
							value: 4
						},
						{
							name: '5 days.',
							value: 5
						},
						{
							name: '6 days.',
							value: 6
						},
						{
							name: '7 days.',
							value: 7
						}
					],
					required: false
				},
				{
					name: 'notify',
					description: 'Notify the user with a DM.',
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: 'Notify with the reason.',
							value: 'notify-with-reason'
						},
						{
							name: 'Notify without the reason.',
							value: 'notify-without-reason'
						},
						{
							name: "Don't notify. (default)",
							value: 'dont-notify'
						}
					],
					required: false
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Moderation',
			clientPermissions: ['BanMembers'],
			userPermissions: ['BanMembers'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason');
		const days = interaction.options.getInteger('days') ?? 1;
		const notify = interaction.options.getString('notify');
		const visible = interaction.options.getBoolean('visible') ?? false;

		if (user.id === interaction.user.id) {
			return interaction.reply({ content: `You can't ban yourself.`, flags: MessageFlags.Ephemeral });
		}
		if (user.id === this.client.user.id) {
			return interaction.reply({ content: `You cannot ban me!`, flags: MessageFlags.Ephemeral });
		}

		const members = await interaction.guild?.members.fetch();
		const member = members?.get(user.id);
		if (member && member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot ban a member who has a higher or equal role than yours.',
				flags: MessageFlags.Ephemeral
			});
		}
		if (member && !member.bannable) {
			return interaction.reply({
				content: `I cannot ban a member who has a higher or equal role than mine.`,
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.deferReply({ ...(!visible && { flags: MessageFlags.Ephemeral }) });
		await interaction.guild?.members.ban(user, { deleteMessageDays: days, reason: reason as string });
		await interaction.guild?.members.unban(user, reason as string);

		if (notify) {
			if (notify !== 'dont-notify') {
				if (!user.bot) {
					const replies = [`You've been banned from ${bold(interaction.guild?.name)}`];

					if (reason && notify === 'notify-with-reason') {
						replies.splice(1, 0, `${bold(italic('Reason:'))} ${reason}`);
					}

					await user.send({ content: replies.join('\n') }).catch(() => {});
				}
			}
		}

		const replies = [
			`${bold(user.tag)} was softbanned!`,
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
