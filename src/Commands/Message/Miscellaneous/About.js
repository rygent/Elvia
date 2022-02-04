const Command = require('../../../Structures/Command.js');
const { Formatters, MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../package.json');
const { Color, Emoji } = require('../../../Settings/Configuration.js');
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
			osInfo: 'distro, arch, release',
			cpu: 'manufacturer, brand, speedMin, speedMax, physicalCores, cores',
			mem: 'used, total',
			diskLayout: 'type, name, size',
			time: 'uptime'
		};
		const sys = await si.get(value);

		const status = {
			online: `${Emoji.ONLINE} Online`,
			idle: `${Emoji.IDLE} Idle`,
			dnd: `${Emoji.DND} Do Not Disturb`,
			invisible: `${Emoji.OFFLINE} Invisible`
		};

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor({ name: this.client.user.tag, iconURL: this.client.user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${this.client.user.id}\``,
				`***Owners:*** ${this.client.utils.formatArray(this.client.owners.map(x => Formatters.userMention(x)))}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${version}`,
				`***Node.JS:*** [${process.version}](https://nodejs.org/)`,
				`***Library:*** [Discord.JS v${discordVersion}](https://discord.js.org/)`,
				`***Registered:*** ${Formatters.time(new Date(this.client.user.createdAt))} (${Formatters.time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addField('__Systems__', [
				`***OS:*** ${sys.osInfo.distro} ${sys.osInfo.arch} ${sys.osInfo.release}`,
				`***CPU:*** ${sys.cpu.manufacturer} ${sys.cpu.brand} @ ${sys.cpu.speedMin}Ghz ${sys.cpu.speedMax}Ghz ${sys.cpu.physicalCores} Cores ${sys.cpu.cores} Threads`,
				`***Memory:*** ${this.client.utils.formatBytes(sys.mem.used)} / ${this.client.utils.formatBytes(sys.mem.total)}`,
				`***Disk:*** ${sys.diskLayout[0].type} ${sys.diskLayout[0].name} ${this.client.utils.formatBytes(sys.diskLayout[0].size)}`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`,
				`***Host:*** ${moment.duration(sys.time.uptime * 1000).format('D [days], H [hrs], m [mins], s [secs]')}`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

		return message.reply({ embeds: [embed] });
	}

};
