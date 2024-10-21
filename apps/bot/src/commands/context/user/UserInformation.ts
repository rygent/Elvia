import { Client, Command } from '@elvia/tesseract';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { EmbedBuilder } from '@discordjs/builders';
import {
	type Guild,
	type GuildMember,
	type PermissionsString,
	type UserContextMenuCommandInteraction
} from 'discord.js';
import { bold, inlineCode, italic, time, underline } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/Constants.js';
import { formatArray, formatPermissions, trimArray } from '@/lib/utils/Functions.js';
import { Badges } from '@/lib/utils/emojis.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.User,
			name: 'User Information',
			description: '',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild]
		});
	}

	public async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user') as GuildMember;

		const userFlags = member.user.flags!.toArray();
		const badges = userFlags.map((item) => Badges[item]).filter((value) => value !== '');

		const banner = await member.user.fetch(true);
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() as string })
			.setThumbnail(member.user.displayAvatarURL({ size: 512 }))
			.setDescription(
				[
					`${bold(italic('ID:'))} ${inlineCode(member.id)}`,
					`${bold(italic('Display Name:'))} ${member.user.globalName ?? inlineCode('N/A')}`,
					`${bold(italic('Nickname:'))} ${member.nickname ?? inlineCode('N/A')}`,
					`${bold(italic('Badges:'))} ${
						badges.length ? userFlags.map((item) => Badges[item]).join(' ') : inlineCode('N/A')
					}`,
					`${bold(italic('Pending:'))} ${member.pending ? 'Yes' : 'No'}`,
					`${bold(italic('Created:'))} ${time(new Date(member.user.createdTimestamp), 'D')} (${time(
						new Date(member.user.createdTimestamp),
						'R'
					)})`,
					`${bold(italic('Joined:'))} ${time(new Date(member.joinedAt as Date), 'D')} (${time(
						new Date(member.joinedAt as Date),
						'R'
					)})`
				].join('\n')
			)
			.addFields({
				name: underline(italic(`Roles [${roles.length ? roles.length : 1}]`)),
				value: `${roles.length ? formatArray(trimArray(roles, { length: 10 })) : 'None'}`,
				inline: false
			})
			.setImage(banner.bannerURL({ size: 4096 }) as string)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		if (resolvePermissions(member)?.length) {
			embed.addFields({
				name: underline(italic('Key Permissions')),
				value: `${formatArray(
					resolvePermissions(member)!
						.map((item) => formatPermissions(item))
						.sort((a, b) => a.localeCompare(b))
				)}`,
				inline: false
			});
		}

		if (resolveAcknowledgements(interaction.guild, member)) {
			embed.addFields({
				name: underline(italic('Acknowledgements')),
				value: resolveAcknowledgements(interaction.guild, member) as string,
				inline: false
			});
		}

		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

function resolvePermissions(member: GuildMember): PermissionsString[] | undefined {
	const list = [
		'Administrator',
		'BanMembers',
		'DeafenMembers',
		'KickMembers',
		'ManageChannels',
		'ManageGuildExpressions',
		'ManageEvents',
		'ManageGuild',
		'ManageMessages',
		'ManageNicknames',
		'ManageRoles',
		'ManageThreads',
		'ManageWebhooks',
		'ModerateMembers',
		'MuteMembers'
	] as PermissionsString[];

	const permissions = member.permissions.toArray();

	if (list.some((item) => permissions.includes(item))) {
		return permissions.filter((item) => list.includes(item));
	}
}

function resolveAcknowledgements(guild: Guild, member: GuildMember): string | undefined {
	if (guild.ownerId === member.id) {
		return 'Server Owner';
	}

	const permissions = member.permissions.toArray();
	if (permissions.includes('Administrator')) {
		return 'Server Administrator';
	}

	if (permissions.includes('ManageGuild')) {
		return 'Server Manager';
	}
}
