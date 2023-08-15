import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'kick',
			description: 'Kick a member with optional reason.',
			category: 'Moderation',
			memberPermissions: ['KickMembers'],
			clientPermissions: ['KickMembers'],
			guildOnly: true
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
				ephemeral: true
			});
		}

		if (member.user.id === interaction.user.id) {
			return interaction.reply({ content: `You can't kick yourself.`, ephemeral: true });
		}
		if (member.user.id === this.client.user.id) {
			return interaction.reply({ content: `You cannot kick me!`, ephemeral: true });
		}
		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot kick a member who has a higher or equal role than yours.',
				ephemeral: true
			});
		}
		if (!member.kickable) {
			return interaction.reply({
				content: `I cannot kick a member who has a higher or equal role than mine.`,
				ephemeral: true
			});
		}

		await interaction.deferReply({ ephemeral: !visible });
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
