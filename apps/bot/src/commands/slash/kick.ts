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
			name: 'kick',
			description: 'Kick a member with optional reason.',
			options: [
				{
					name: 'member',
					description: 'Member to kick.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'reason',
					description: 'Reason of the kick.',
					type: ApplicationCommandOptionType.String,
					max_length: 500,
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
			defaultMemberPermissions: new PermissionsBitField(['KickMembers']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Moderation',
			clientPermissions: ['KickMembers'],
			userPermissions: ['KickMembers'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user = interaction.options.getUser('member', true);
		const reason = interaction.options.getString('reason');
		const notify = interaction.options.getString('notify');
		const visible = interaction.options.getBoolean('visible') ?? false;

		const members = await interaction.guild?.members.fetch();
		const member = members?.get(user.id);
		if (!member) {
			return interaction.reply({
				content: 'Member not found, please verify that this user is a server member.',
				flags: MessageFlags.Ephemeral
			});
		}

		if (member.user.id === interaction.user.id) {
			return interaction.reply({ content: `You can't kick yourself.`, flags: MessageFlags.Ephemeral });
		}
		if (member.user.id === this.client.user.id) {
			return interaction.reply({ content: `You cannot kick me!`, flags: MessageFlags.Ephemeral });
		}
		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot kick a member who has a higher or equal role than yours.',
				flags: MessageFlags.Ephemeral
			});
		}
		if (!member.kickable) {
			return interaction.reply({
				content: `I cannot kick a member who has a higher or equal role than mine.`,
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.deferReply({ ...(!visible && { flags: MessageFlags.Ephemeral }) });
		await interaction.guild?.members.kick(member, reason as string);

		if (notify) {
			if (notify !== 'dont-notify') {
				if (!user.bot) {
					const replies = [`You've been kicked from ${bold(interaction.guild?.name)}`];

					if (reason && notify === 'notify-with-reason') {
						replies.splice(1, 0, `${bold(italic('Reason:'))} ${reason}`);
					}

					await user.send({ content: replies.join('\n') }).catch(() => {});
				}
			}
		}

		const replies = [`${bold(user.tag)} was kicked!`, ...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])].join(
			'\n'
		);

		return interaction.editReply({ content: replies });
	}
}
