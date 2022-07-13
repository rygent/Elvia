import Command from '../../../Structures/Command.js';
import { EmbedBuilder } from '@discordjs/builders';
import { time, userMention, version as DJSVersion } from 'discord.js';
import { createRequire } from 'node:module';
import { Colors, Emojis } from '../../../Utils/Constants.js';
import si from 'systeminformation';
import moment from 'moment';
import 'moment-duration-format';
const require = createRequire(import.meta.url);
const { version: BOTVersion } = require('../../../../package.json');

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'about',
			aliases: ['botinfo', 'info'],
			description: 'Get bots information.',
			category: 'Miscellaneous',
			disabled: true
		});
	}

	async run(message) {
		const opts = {
			osInfo: 'platform, distro, release, kernel, arch',
			cpu: 'manufacturer, brand, speed, speedMax, physicalCores, cores',
			mem: 'used, total',
			fsSize: 'used, size',
			time: 'uptime'
		};
		const sys = await si.get(opts);

		const status = {
			online: `${Emojis.Online} Online`,
			idle: `${Emojis.Idle} Idle`,
			dnd: `${Emojis.Dnd} Do Not Disturb`,
			invisible: `${Emojis.Offline} Invisible`
		};

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL() })
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setDescription([
				`***ID:*** \`${this.client.user.id}\``,
				`***Developer:*** ${this.client.utils.formatArray(this.client.owners.map(user => userMention(user)))}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${BOTVersion}`,
				`***Node.JS:*** ${process.version}`,
				`***Library:*** Discord.JS v${DJSVersion}`,
				`***Created:*** ${time(new Date(this.client.user.createdAt), 'D')} (${time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addFields({ name: '__System__', value: [
				`***OS:*** ${sys.osInfo.distro} ${sys.osInfo.release}${sys.osInfo.platform !== 'Windows' ? ` ${sys.osInfo.kernel}` : ''} ${sys.osInfo.arch}`,
				`***CPU:*** ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speed}Ghz${isNaN(sys.cpu.speedMax) ? '' : ` ${sys.cpu.speedMax}Ghz`} ${sys.cpu.cores} Cores`,
				`***Memory:*** ${this.client.utils.formatBytes(sys.mem.used)} / ${this.client.utils.formatBytes(sys.mem.total)} (${((sys.mem.used / sys.mem.total) * 100).toFixed(2)}%)`,
				`***Disk:*** ${this.client.utils.formatBytes(sys.fsSize[0].used)} / ${this.client.utils.formatBytes(sys.fsSize[0].size)} (${((sys.fsSize[0].used / sys.fsSize[0].size) * 100).toFixed(2)}%)`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hours], m [minutes], s [seconds]')}`,
				`***Host:*** ${moment.duration(sys.time.uptime * 1000).format('D [days], H [hours], m [minutes], s [seconds]')}`
			].join('\n'), inline: false })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		return message.reply({ embeds: [embed] });
	}

}
