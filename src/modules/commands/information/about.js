const Command = require('../../../structures/Command.js');
const { MessageEmbed, version: discordVersion } = require('discord.js');
const { version } = require('../../../../package.json');
const { Colors, Emojis, Owners } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'about',
			aliases: ['botinfo', 'info'],
			description: 'Shows some information about the running instance!',
			category: 'information',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message) {
		const Owner = this.client.users.cache.get(Owners) || await this.client.fetchUser(Owners);

		const status = {
			online: `${Emojis.ONLINE} Online`,
			idle: `${Emojis.IDLE} Idle`,
			dnd: `${Emojis.DND} Do Not Disturb`,
			invisible: `${Emojis.OFFLINE} Offline`
		};

		let roleColor;
		if (!message.guild) {
			roleColor = Colors.DEFAULT;
		} else {
			roleColor = message.guild.me.roles.highest.hexColor;
		}

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle(`__Information About ${this.client.user.username}__`)
			.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription(`Hiya, I'm ${this.client.user.username}... I'll be your server assistant & multipurpose bot!\nYou can use \`${this.client.prefix}help\` to get all my commands.`)
			.addField('__Details__', stripIndents`
                ***Username:*** ${this.client.user.tag}
                ***ID:*** ${this.client.user.id}
                ***Creator:*** ${Owner.tag} ${Emojis.DEVELOPER}
                ***Status:*** ${status[this.client.user.presence.status]}
                ***Version:*** v${version}
                ***Node:*** [${process.version}](https://nodejs.org/)
                ***Library:*** [Discord.js v${discordVersion}](https://discord.js.org/)
                ***Created at:*** ${moment(this.client.user.createdAt).format('MMMM D, YYYY HH:mm')} (${moment(this.client.user.createdAt, 'YYYYMMDDHHmmss').fromNow()})`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
