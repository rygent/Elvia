const Command = require('../../../Structures/Command.js');
const { MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../package.json');
const { Colors, Emojis } = require('../../../Structures/Configuration.js');
const moment = require('moment');
const os = require('os');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['botinfo', 'info'],
			description: 'Shows some information about the running instance!',
			category: 'Utilities',
			cooldown: 3000
		});
	}

	async run(message) {
		const Owner = this.client.users.cache.get(this.client.owner);
		const core = os.cpus()[0];

		const status = {
			online: `${Emojis.ONLINE} Online`,
			idle: `${Emojis.IDLE} Idle`,
			dnd: `${Emojis.DND} Do Not Disturb`,
			invisible: `${Emojis.OFFLINE} Offline`
		};

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(`__Information About ${this.client.user.username}__`)
			.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.addField('__Details__', [
				`***Client:*** ${this.client.user.tag} (\`${this.client.user.id}\`)`,
				`***Creator:*** ${Owner.tag} ${Emojis.DEVELOPER}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${version}`,
				`***Node:*** [${process.version}](https://nodejs.org/)`,
				`***Library:*** [Discord.js v${discordVersion}](https://discord.js.org/)`,
				`***Created at:*** ${moment(this.client.user.createdAt).format('MMMM D, YYYY HH:mm')} (${moment(this.client.user.createdAt, 'YYYYMMDDHHmmss').fromNow()})`
			].join('\n'))
			.addField('__Systems__', [
				`***Platform:*** ${os.type} ${os.release} ${os.arch}`,
				`***CPU:*** ${core.model} ${os.cpus().length} Cores ${core.speed}MHz`,
				`***Memory:*** ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)} / ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`,
				`***Host:*** ${moment.duration(os.uptime * 1000).format('D [days], H [hrs], m [mins], s [secs]')}\n`,
				`[Repository](https://github.com/XRzky/Elaina) | [Support Server](https://discord.gg/nW6x9EN) | [Vote](https://discord.boats/bot/614645495779819551)`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
