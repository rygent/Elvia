import Command from '../../../Structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import { time, userMention, version as DJSVersion } from 'discord.js';
import { Colors } from '../../../Utils/Constants.js';
import { formatArray, formatBytes } from '../../../Structures/Util.js';
import { DurationFormatter } from '@sapphire/time-utilities';
import { createRequire } from 'node:module';
import si from 'systeminformation';
const require = createRequire(import.meta.url);
const { version: BOTVersion } = require('../../../../package.json');

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['version'],
			description: 'View information of the bot.'
		});
	}

	async run(interaction) {
		const opts = {
			osInfo: 'platform, distro, release, kernel, arch',
			cpu: 'manufacturer, brand, speed, speedMax, physicalCores, cores',
			mem: 'total',
			time: 'uptime'
		};

		const sys = await si.get(opts);
		const duration = new DurationFormatter();

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL() })
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setDescription([
				`***ID:*** \`${this.client.user.id}\``,
				`***Developer:*** ${formatArray(this.client.owners.map(user => userMention(user)))}`,
				`***Version:*** v${BOTVersion}`,
				`***Node.JS:*** ${process.version}`,
				`***Library:*** Discord.JS v${DJSVersion}`,
				`***Created:*** ${time(new Date(this.client.user.createdAt), 'D')} (${time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addFields({ name: '__System__', value: [
				`***OS:*** ${sys.osInfo.distro} ${sys.osInfo.release}${sys.osInfo.platform !== 'Windows' ? ` ${sys.osInfo.kernel}` : ''} ${sys.osInfo.arch}`,
				`***CPU:*** ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speed}Ghz${isNaN(sys.cpu.speedMax) ? '' : ` ${sys.cpu.speedMax}Ghz`} ${sys.cpu.cores} Cores`,
				`***Memory:*** ${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(process.memoryUsage().heapTotal)} (${formatBytes(sys.mem.total)})`,
				`***Uptime:*** ${duration.format(this.client.uptime, undefined, { right: ', ' })}`,
				`***Host:*** ${duration.format(sys.time.uptime * 1000, undefined, { right: ', ' })}`
			].join('\n'), inline: false })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
