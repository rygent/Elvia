import { Client, Command } from '@elvia/tesseract';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, version } from 'discord.js';
import { bold, inlineCode, italic, time, underline } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/Constants.js';
import { formatArray, formatBytes } from '@/lib/utils/Functions.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import systeminformation from 'systeminformation';
import typescript from 'typescript';

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
		const options = {
			osInfo: 'platform, distro, release, kernel, arch',
			cpu: 'manufacturer, brand, speed, speedMax, physicalCores, cores',
			mem: 'total',
			time: 'uptime'
		};

		const sys = await systeminformation.get(options);
		const duration = new DurationFormatter();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL() })
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setDescription(
				[
					`${bold(italic('ID:'))} ${inlineCode(this.client.user.id)}`,
					`${bold(italic('Developer:'))} ${formatArray(
						this.client.settings.owners.map((user) => this.client.users.cache.get(user)?.tag as string)
					)}`,
					`${bold(italic('Version:'))} v${this.client.version}`,
					`${bold(italic('Node.JS:'))} ${process.version}`,
					`${bold(italic('TypeScript:'))} v${typescript.version}`,
					`${bold(italic('Library:'))} Discord.JS v${version}`,
					`${bold(italic('Created:'))} ${time(new Date(this.client.user.createdAt), 'D')} (${time(
						new Date(this.client.user.createdAt),
						'R'
					)})`
				].join('\n')
			)
			.addFields({
				name: underline(italic('System')),
				value: [
					`${bold(italic('OS:'))} ${sys.osInfo.distro} ${sys.osInfo.release}${
						sys.osInfo.platform === 'Windows' ? '' : ` ${sys.osInfo.kernel}`
					} ${sys.osInfo.arch}`,
					`${bold(italic('CPU:'))} ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speed}Ghz${
						isNaN(sys.cpu.speedMax) ? '' : ` ${sys.cpu.speedMax}Ghz`
					} ${sys.cpu.cores} Cores`,
					`${bold(italic('Memory:'))} ${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(
						process.memoryUsage().heapTotal
					)} (${formatBytes(sys.mem.total)})`,
					`${bold(italic('Uptime:'))} ${duration.format(this.client.uptime, undefined, { right: ', ' })}`,
					`${bold(italic('Host:'))} ${duration.format(sys.time.uptime * 1e3, undefined, { right: ', ' })}`
				].join('\n'),
				inline: false
			})
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed] });
	}
}
