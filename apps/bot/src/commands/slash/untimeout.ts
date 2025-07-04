import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { PermissionsBitField, type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'untimeout',
			description: 'Remove timeout from a member.',
			options: [
				{
					name: 'member',
					description: 'Member to remove timeout from.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'reason',
					description: 'Reason of the timeout removal.',
					type: ApplicationCommandOptionType.String,
					max_length: 500,
					required: false
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['ModerateMembers']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Moderation',
			clientPermissions: ['ModerateMembers'],
			userPermissions: ['ModerateMembers'],
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user = interaction.options.getUser('member', true);
		const reason = interaction.options.getString('reason');
		const visible = interaction.options.getBoolean('visible') ?? false;

		const members = await interaction.guild?.members.fetch();
		const member = members?.get(user.id);
		if (!member) {
			return interaction.reply({
				content: 'Member not found, please verify that this user is a server member.',
				flags: MessageFlags.Ephemeral
			});
		}

		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot remove a timeout from a member who has a higher or equal role than yours.',
				flags: MessageFlags.Ephemeral
			});
		}

		if (!member.moderatable) {
			return interaction.reply({
				content: `I cannot remove a timeout from a member who has a higher or equal role than mine.`,
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });
		await member.timeout(null, reason as string);

		const replies = [
			`${bold(member.user.tag)} is no longer timed out!`,
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
