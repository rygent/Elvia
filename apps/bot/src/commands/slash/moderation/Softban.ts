import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'softban',
			description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
			category: 'Moderation',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason');
		const days = interaction.options.getInteger('days') ?? 1;
		const notify = interaction.options.getString('notify');
		const visible = interaction.options.getBoolean('visible') ?? false;

		if (user.id === interaction.user.id) {
			return interaction.reply({ content: `You can't ban yourself.`, ephemeral: true });
		}
		if (user.id === this.client.user.id) return interaction.reply({ content: `You cannot ban me!`, ephemeral: true });

		const members = await interaction.guild?.members.fetch();
		const member = members?.get(user.id);
		if (member && member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot ban a member who has a higher or equal role than yours.',
				ephemeral: true
			});
		}
		if (member && !member.bannable) {
			return interaction.reply({
				content: `I cannot ban a member who has a higher or equal role than mine.`,
				ephemeral: true
			});
		}

		await interaction.deferReply({ ephemeral: !visible });
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
