import { CoreContext, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	SectionBuilder,
	SeparatorBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder
} from '@discordjs/builders';
import {
	type Guild,
	type GuildMember,
	type PermissionsString,
	type UserContextMenuCommandInteraction
} from 'discord.js';
import { bold, inlineCode, subtext, time } from '@discordjs/formatters';
import { formatArray, formatPermissions, trimArray } from '@/lib/utils/functions.js';
import { Badges } from '@/lib/utils/emojis.js';

export default class extends CoreContext {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.User,
			name: 'User Information',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild]
		});
	}

	public async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user')!;

		const flags = member.user.flags!.toArray();
		const badges = flags.map((flag) => Badges[flag]).filter((value) => value !== '');

		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);

		const container = new ContainerBuilder()
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								`${bold('ID:')} ${inlineCode(member.id)}`,
								`${bold('Username:')} ${member.user.tag}`,
								`${bold('Display Name:')} ${member.user.globalName ?? inlineCode('N/A')}`,
								`${bold('Nickname:')} ${member.nickname ?? inlineCode('N/A')}`,
								`${bold('Badges:')} ${badges.length ? badges.join(' ') : inlineCode('N/A')}`,
								`${bold('Pending:')} ${member.pending ? 'Yes' : 'No'}`,
								`${bold('Created:')} ${time(new Date(member.user.createdTimestamp), 'D')} (${time(
									new Date(member.user.createdTimestamp),
									'R'
								)})`,
								`${bold('Joined:')} ${time(new Date(member.joinedAt!), 'D')} (${time(new Date(member.joinedAt!), 'R')})`
							].join('\n')
						)
					)
					.setThumbnailAccessory(new ThumbnailBuilder().setURL(member.displayAvatarURL({ size: 1024 })))
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold(`Roles [${roles.length ? roles.length : 1}]:`)} ${roles.length ? formatArray(trimArray(roles, { length: 10 })) : 'None'}`,
						...(resolvePermissions(member)?.length
							? [
									`${bold('Key Permissions:')} ${formatArray(
										resolvePermissions(member)!
											.map((item) => formatPermissions(item))
											.sort((a, b) => a.localeCompare(b))
									)}`
								]
							: []),
						...(resolveAcknowledgements(interaction.guild, member)
							? [`${bold('Acknowledgements:')} ${resolveAcknowledgements(interaction.guild, member)}`]
							: [])
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		if (member.banner) {
			const banner = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(member.bannerURL({ size: 1024 })!)
			);
			container.spliceComponents(2, 0, banner);
		}

		return interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] });
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
