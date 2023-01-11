import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic, time } from '@discordjs/formatters';
import { Duration } from '@sapphire/time-utilities';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'timeout',
			description: 'Timeout a member with duration and optional reason.',
			category: 'Moderation',
			memberPermissions: ['ModerateMembers'],
			clientPermissions: ['ModerateMembers'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user = interaction.options.getUser('member', true);
		const duration = interaction.options.getString('duration', true);
		const reason = interaction.options.getString('reason');
		const notify = interaction.options.getString('notify');
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

		const members = await interaction.guild?.members.fetch();
		const member = members?.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.user.id === interaction.user.id) return interaction.reply({ content: `You can't timeout yourself.`, ephemeral: true });
		if (member.user.id === this.client.user.id) return interaction.reply({ content: `You cannot timeout me!`, ephemeral: true });
		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot timeout a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.moderatable) return interaction.reply({ content: `I cannot timeout a member who has a higher or equal role than mine.`, ephemeral: true });

		let { offset } = new Duration(duration);
		if (offset > 24192e5) return interaction.reply({ content: 'The duration is too long. The maximum duration is 28 days.', ephemeral: true });
		else if (offset > 241884e4 && offset <= 24192e5) offset = 241884e4;

		await interaction.deferReply({ ephemeral });
		await member.timeout(offset, reason as string);

		if (notify) {
			if (notify !== 'dont-notify') {
				if (!member.user.bot) {
					const replies = [
						`You've been timed out in ${bold(interaction.guild?.name)}`,
						`${bold(italic('Expiration:'))} ${time(new Date(Date.now() + offset), 'R')}`
					];

					if (reason && notify === 'notify-with-reason') {
						replies.splice(1, 0, `${bold(italic('Reason:'))} ${reason}`);
					}

					await member.send({ content: replies.join('\n') }).catch(() => {});
				}
			}
		}

		const replies = [
			`${bold(member.user.tag)} was timed out!`,
			...reason ? [`${bold(italic('Reason:'))} ${reason}`] : [],
			`${bold(italic('Expiration:'))} ${time(new Date(Date.now() + offset), 'R')}`
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
