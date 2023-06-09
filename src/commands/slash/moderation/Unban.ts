import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'unban',
			description: 'Unban a user with optional reason.',
			category: 'Moderation',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers'],
			guildOnly: true
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
		if (!target) return interaction.reply({ content: 'This user is not banned on this server.', ephemeral: true });

		await interaction.deferReply({ ephemeral: !visible });
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
