const Command = require('../../../structures/Command.js');
const { MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../package.json');
const { Colors, Emojis } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['botinfo', 'info'],
			description: 'Shows some information about the running instance!',
			category: 'utility',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, _args, data) {
		const Owner = this.client.users.cache.get(this.client.owner);
		const prefixes = data.guild ? data.guild.prefix : this.client.prefix;

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
			.setDescription(`Hiya, I'm ${this.client.user.username}... I'll be your server assistant & multipurpose bot!\nYou can use \`${prefixes}help\` to get all my commands.`)
			.addField('__Details__', stripIndents`
                ***Username:*** ${this.client.user.tag}
                ***ID:*** ${this.client.user.id}
                ***Creator:*** ${Owner.tag} ${Emojis.DEVELOPER}
                ***Status:*** ${status[this.client.user.presence.status]}
                ***Version:*** v${version}
                ***Node:*** [${process.version}](https://nodejs.org/)
                ***Library:*** [Discord.js v${discordVersion}](https://discord.js.org/)
                ***Created at:*** ${moment(this.client.user.createdAt).format('MMMM D, YYYY HH:mm')} (${moment(this.client.user.createdAt, 'YYYYMMDDHHmmss').fromNow()})`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
