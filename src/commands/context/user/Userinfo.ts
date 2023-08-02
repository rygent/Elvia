import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { ContextMenuCommandInteraction, Guild, GuildMember, PermissionsString } from 'discord.js';
import { bold, inlineCode, italic, time, underscore } from '@discordjs/formatters';
import { Colors } from '#lib/utils/Constants.js';
import { formatArray, formatPermissions, trimArray } from '#lib/utils/Function.js';
import flags from '#assets/ts/Badges.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'User Information',
			context: true
		});
	}

	public async execute(interaction: ContextMenuCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user') as GuildMember;

		const userFlags = member.user.flags!.toArray();
		const badges = userFlags.map((item) => flags[item]).filter((value) => value !== '');

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
						badges.length ? userFlags.map((item) => flags[item]).join(' ') : inlineCode('N/A')
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
				name: underscore(italic(`Roles [${roles.length ? roles.length : 1}]`)),
				value: `${roles.length ? formatArray(trimArray(roles, { length: 10 })) : 'None'}`,
				inline: false
			})
			.setImage(banner.bannerURL({ size: 4096 }) as string)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		if (resolvePermissions(member)?.length) {
			embed.addFields({
				name: underscore(italic('Key Permissions')),
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
				name: underscore(italic('Acknowledgements')),
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
		'ManageEmojisAndStickers',
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
