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
import { ChatInputCommandInteraction, version as DjsVersion } from 'discord.js';
import { bold, inlineCode, subtext, time } from '@discordjs/formatters';
import { formatArray, formatBytes } from '@/lib/utils/functions.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import * as system from 'systeminformation';
import { version as TsVersion } from 'typescript';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'statistics',
			description: 'Get statistics of the bot.',
			defaultMemberPermissions: '0',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Developer',
			owner: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		await interaction.deferReply();

		const options = {
			osInfo: 'platform, distro, release, kernel, arch',
			cpu: 'manufacturer, brand, speed, speedMax, physicalCores, cores',
			mem: 'total',
			time: 'uptime'
		};

		const sys = await system.get(options);
		const duration = new DurationFormatter();

		const container = new ContainerBuilder()
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								`${bold('ID:')} ${inlineCode(this.client.user.id)}`,
								`${bold('Developer:')} ${formatArray(
									this.client.settings.owners.map((user) => this.client.users.cache.get(user)?.tag as string)
								)}`,
								`${bold('Version:')} v${this.client.version}`,
								`${bold('Node.JS:')} ${process.version}`,
								`${bold('TypeScript:')} v${TsVersion}`,
								`${bold('Library:')} Discord.JS v${DjsVersion}`,
								`${bold('Created:')} ${time(new Date(this.client.user.createdAt), 'D')} (${time(
									new Date(this.client.user.createdAt),
									'R'
								)})`
							].join('\n')
						)
					)
					.setThumbnailAccessory(new ThumbnailBuilder().setURL(this.client.user.displayAvatarURL({ size: 1024 })))
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('OS:')} ${sys.osInfo.distro} ${sys.osInfo.release}${
							sys.osInfo.platform === 'Windows' ? '' : ` ${sys.osInfo.kernel}`
						} ${sys.osInfo.arch}`,
						`${bold('CPU:')} ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speed}Ghz${
							isNaN(sys.cpu.speedMax) ? '' : ` ${sys.cpu.speedMax}Ghz`
						} ${sys.cpu.cores} Cores`,
						`${bold('Memory:')} ${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(
							process.memoryUsage().heapTotal
						)} (${formatBytes(sys.mem.total)})`,
						`${bold('Uptime:')} ${duration.format(this.client.uptime, undefined, { right: ', ' })}`,
						`${bold('Host:')} ${duration.format(sys.time.uptime * 1e3, undefined, { right: ', ' })}`
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		if (this.client.user.banner) {
			const banner = new MediaGalleryBuilder().addItems(
				new MediaGalleryItemBuilder().setURL(this.client.user.bannerURL({ size: 1024 }) as string)
			);
			container.spliceComponents(2, 0, banner);
		}

		return interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
