import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { PermissionsBitField, type ChatInputCommandInteraction } from 'discord.js';
import { bold, italic, time } from '@discordjs/formatters';
import { Duration } from '@sapphire/time-utilities';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'timeout',
			description: 'Timeout a member with duration and optional reason.',
			options: [
				{
					name: 'member',
					description: 'Member to timeout.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'duration',
					description: 'Duration of the timeout. (Example: 2d for 2 days)',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'reason',
					description: 'Reason of the timeout.',
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
		const duration = interaction.options.getString('duration', true);
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
			return interaction.reply({ content: `You can't timeout yourself.`, ephemeral: true });
		}
		if (member.user.id === this.client.user.id) {
			return interaction.reply({ content: `You cannot timeout me!`, ephemeral: true });
		}
		if (member.roles.highest.comparePositionTo(interaction.member?.roles.highest) > 0) {
			return interaction.reply({
				content: 'You cannot timeout a member who has a higher or equal role than yours.',
				ephemeral: true
			});
		}
		if (!member.moderatable) {
			return interaction.reply({
				content: `I cannot timeout a member who has a higher or equal role than mine.`,
				ephemeral: true
			});
		}

		let { offset } = new Duration(duration);
		if (offset > 24192e5) {
			return interaction.reply({
				content: 'The duration is too long. The maximum duration is 28 days.',
				ephemeral: true
			});
		} else if (offset > 241884e4 && offset <= 24192e5) {
			offset = 241884e4;
		} else if (isNaN(offset)) {
			return interaction.reply({ content: `You need to specify a duration for the timeout.`, ephemeral: true });
		}

		if (Date.now() <= Number(member.communicationDisabledUntilTimestamp)) {
			return interaction.reply({ content: `${bold(member.user.tag)} is already timed out.`, ephemeral: true });
		}

		await interaction.deferReply({ ephemeral: !visible });
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
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : []),
			`${bold(italic('Expiration:'))} ${time(new Date(Date.now() + offset), 'R')}`
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
