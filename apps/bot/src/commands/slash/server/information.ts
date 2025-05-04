import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
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
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, subtext, time, userMention } from '@discordjs/formatters';
import { formatArray, formatNumber, trimArray } from '@/lib/utils/functions.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'information',
			description: 'Get server information.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Utility',
			guild: true
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const ContentFilterLevel = ['None', 'Scan messages from those without a role', 'Scan all messages'];
		const VerificationLevel = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

		const channels = interaction.guild.channels.cache;
		const roles = interaction.guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);

		const detail = new TextDisplayBuilder().setContent(
			[
				`${bold('ID:')} ${inlineCode(interaction.guildId)}`,
				`${bold('Name:')} ${interaction.guild.name}`,
				`${bold('Owner:')} ${userMention(interaction.guild.ownerId)}`,
				`${bold('Boost Status:')} ${interaction.guild.premiumSubscriptionCount!} Boosts (${inlineCode(
					`Level ${interaction.guild.premiumTier}`
				)})`,
				`${bold('Explicit Filter:')} ${ContentFilterLevel[interaction.guild.explicitContentFilter]}`,
				`${bold('Verification:')} ${VerificationLevel[interaction.guild.verificationLevel]}`,
				`${bold('Created:')} ${time(new Date(interaction.guild.createdTimestamp), 'D')} (${time(
					new Date(interaction.guild.createdTimestamp),
					'R'
				)})`,
				`${bold('Channel:')} ${formatNumber(
					channels.filter((channel) => channel.isTextBased()).size
				)} Text / ${formatNumber(channels.filter((channel) => channel.isVoiceBased()).size)} Voice`,
				`${bold('Member:')} ${formatNumber(interaction.guild.memberCount)} members`
			].join('\n')
		);

		const container = new ContainerBuilder()
			.addTextDisplayComponents(detail)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`${bold(`Roles [${roles.length}]:`)} ${roles?.length ? formatArray(trimArray(roles, { length: 10 })) : 'None'}`
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		if (interaction.guild.icon) {
			const section = new SectionBuilder()
				.addTextDisplayComponents(detail)
				.setThumbnailAccessory(new ThumbnailBuilder().setURL(interaction.guild.iconURL({ size: 1024 })!));
			container.spliceComponents(0, 1, section);
		}

		if (interaction.guild.banner) {
			const banner = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(interaction.guild.bannerURL({ size: 1024 })!)
			);
			container.spliceComponents(2, 0, banner);
		}

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
