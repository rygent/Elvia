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
			name: 'unban',
			description: 'Unban a user with optional reason.',
			options: [
				{
					name: 'user',
					description: 'User to unban. (Username or User ID)',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'reason',
					description: 'Reason of the unban.',
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
		const notify = interaction.options.getString('notify');
		const visible = interaction.options.getBoolean('visible') ?? false;

		const banned = await interaction.guild?.bans.fetch();

		const target = banned?.find(
			(member) => member.user.id.includes(user.id) || member.user.tag.includes(user.tag)
		)?.user;
		if (!target) {
			return interaction.reply({ content: 'This user is not banned on this server.', flags: MessageFlags.Ephemeral });
		}

		await interaction.deferReply({ ...(!visible && { flags: MessageFlags.Ephemeral }) });
		await interaction.guild?.members.unban(target, reason as string);

		if (notify) {
			if (notify !== 'dont-notify') {
				if (!user.bot) {
					const replies = [`You've been unbanned from ${bold(interaction.guild?.name)}`];

					if (reason && notify === 'notify-with-reason') {
						replies.splice(1, 0, `${bold(italic('Reason:'))} ${reason}`);
					}

					await user.send({ content: replies.join('\n') }).catch(() => {});
				}
			}
		}

		const replies = [
			`${bold(user.tag)} was unbanned!`,
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
