const Command = require('../../../Structures/Command');
const { Formatters, MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../package.json');
const { Colors, Emojis } = require('../../../Utils/Constants');
const moment = require('moment');
const si = require('systeminformation');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['botinfo', 'info'],
			description: 'Get bots information.',
			category: 'Miscellaneous'
		});
	}

	async run(message) {
		const value = {
			osInfo: 'platform, distro, release, kernel, arch',
			cpu: 'manufacturer, brand, speed, speedMax, physicalCores, cores',
			mem: 'used, total',
			fsSize: 'used, size',
			time: 'uptime'
		};
		const sys = await si.get(value);

		const status = {
			online: `${Emojis.Online} Online`,
			idle: `${Emojis.Idle} Idle`,
			dnd: `${Emojis.Dnd} Do Not Disturb`,
			invisible: `${Emojis.Offline} Invisible`
		};

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${this.client.user.id}\``,
				`***Developer:*** ${this.client.utils.formatArray(this.client.owners.map(x => Formatters.userMention(x)))}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${version}`,
				`***Node.JS:*** ${process.version}`,
				`***Library:*** Discord.JS v${discordVersion}`,
				`***Registered:*** ${Formatters.time(new Date(this.client.user.createdAt), 'D')} (${Formatters.time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addField('__System__', [
				`***OS:*** ${sys.osInfo.distro} ${sys.osInfo.release}${sys.osInfo.platform !== 'Windows' ? ` ${sys.osInfo.kernel}` : ''} ${sys.osInfo.arch}`,
				`***CPU:*** ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speed}Ghz${isNaN(sys.cpu.speedMax) ? '' : ` ${sys.cpu.speedMax}Ghz`} ${sys.cpu.cores} Cores`,
				`***Memory:*** ${this.client.utils.formatBytes(sys.mem.used)} / ${this.client.utils.formatBytes(sys.mem.total)} (${((sys.mem.used / sys.mem.total) * 100).toFixed(2)}%)`,
				`***Disk:*** ${this.client.utils.formatBytes(sys.fsSize[0].used)} / ${this.client.utils.formatBytes(sys.fsSize[0].size)} (${((sys.fsSize[0].used / sys.fsSize[0].size) * 100).toFixed(2)}%)`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hours], m [minutes], s [seconds]')}`,
				`***Host:*** ${moment.duration(sys.time.uptime * 1000).format('D [days], H [hours], m [minutes], s [seconds]')}`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

		return message.reply({ embeds: [embed] });
	}

};
