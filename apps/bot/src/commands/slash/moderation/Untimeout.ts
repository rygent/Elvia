import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'untimeout',
			description: 'Remove timeout from a member.',
			category: 'Moderation',
			memberPermissions: ['ModerateMembers'],
			clientPermissions: ['ModerateMembers'],
			guildOnly: true
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
				ephemeral: true
			});
		}

		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot remove a timeout from a member who has a higher or equal role than yours.',
				ephemeral: true
			});
		}

		if (!member.moderatable) {
			return interaction.reply({
				content: `I cannot remove a timeout from a member who has a higher or equal role than mine.`,
				ephemeral: true
			});
		}

		await interaction.deferReply({ ephemeral: !visible });
		await member.timeout(null, reason as string);

		const replies = [
			`${bold(member.user.tag)} is no longer timed out!`,
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
