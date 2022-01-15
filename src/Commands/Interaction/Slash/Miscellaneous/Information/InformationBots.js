const Interaction = require('../../../../../Structures/Interaction.js');
const { Formatters, MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../../../package.json');
const { Color, Emoji } = require('../../../../../Utils/Configuration.js');
const moment = require('moment');
const os = require('os');
require('moment-duration-format');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'information',
			subCommand: 'bots',
			description: 'Get bots information.'
		});
	}

	async run(interaction) {
		const core = os.cpus()[0];

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
				`***Creators:*** ${Formatters.userMention(this.client.owners[0])}`,
				`***Status:*** ${status[this.client.user.presence.status]}`,
				`***Version:*** v${version}`,
				`***Node.JS:*** [${process.version}](https://nodejs.org/)`,
				`***Library:*** [Discord.JS v${discordVersion}](https://discord.js.org/)`,
				`***Registered:*** ${Formatters.time(new Date(this.client.user.createdAt))} (${Formatters.time(new Date(this.client.user.createdAt), 'R')})`
			].join('\n'))
			.addField('__Systems__', [
				`***Platform:*** ${os.type} ${os.release} ${os.arch}`,
				`***CPU:*** ${core.model} ${os.cpus().length} Cores ${core.speed}MHz`,
				`***Memory:*** ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)} / ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
				`***Uptime:*** ${moment.duration(this.client.uptime).format('D [days], H [hrs], m [mins], s [secs]')}`,
				`***Host:*** ${moment.duration(os.uptime * 1000).format('D [days], H [hrs], m [mins], s [secs]')}`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		return await interaction.reply({ embeds: [embed] });
	}

};
