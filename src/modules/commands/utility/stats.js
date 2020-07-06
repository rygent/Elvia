const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');
const osu = require('node-os-utils');
const os = require('os');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['specs'],
			description: 'Displays the bots statistics!',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message) {
		const freeRAM = os.freemem();
		const usedRAM = os.totalmem() - freeRAM;

		const full = '▰';
		const empty = '▱';
		const diagramMaker = (used, free) => {
			const total = used + free;
			used = Math.round((used / total) * 10);
			free = Math.round((free / total) * 10);
			return full.repeat(used) + empty.repeat(free);
		};

		let cpuUsage;

		const p1 = osu.cpu.usage().then((cpuPercentage) => {
			cpuUsage = cpuPercentage;
		});

		await Promise.all([p1]);

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setAuthor(`${this.client.user.username}'s statistics information`, this.client.user.avatarURL({ dynamic: true }))
			.setDescription('Here are some stats about the bot and other stuff')
			.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.addField('__Performance__', stripIndents`
                ***RAM:*** ${diagramMaker(usedRAM, freeRAM)} [${Math.round(100 * usedRAM / (usedRAM + freeRAM))}%]
                ***CPU:*** ${diagramMaker(cpuUsage, 100 - cpuUsage)} [${Math.round(cpuUsage)}%]`, false)
			.addField('__System__', stripIndents`
                ***Processor:*** ${os.cpus()[0].model} (${osu.cpu.count()} Cores)
                ***Total RAM:*** ${(usedRAM / 1024 / 1024 / 1024).toFixed(2)} GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, false)
			.addField('__Operation System__', `${os.type} ${os.release} ${os.arch}`, false)
			.addField('__Total Users__', this.client.users.cache.size, true)
			.addField('__Total Emotes__', this.client.emojis.cache.size, true)
			.addField('__Total Guilds__', this.client.guilds.cache.size, true)
			.addField('__Bot Uptime__', moment.duration(this.client.uptime).format('D [days], H [hrs], m [mins], s [secs]'), true)
			.addField('__Host Uptime__', moment.duration(os.uptime * 1000).format('D [days], H [hrs], m [mins], s [secs]'), true)
			.addField('__Last Started__', moment(this.client.readyAt).format('MMMM DD, YYYY HH:mm'))
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
