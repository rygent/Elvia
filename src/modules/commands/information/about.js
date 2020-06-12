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
			.setDescription(`Hiya, I'm ${this.client.user.username}... I'll be your server assistant & multipurpose bot!\nYou can use \`${this.client.PREFIX}help\` to get all my commands.`)
			.addField('__Details__', stripIndents`
                _Username:_ **${this.client.user.tag}**
                _ID:_ **${this.client.user.id}**
                _Creator:_ **${Owner.tag}** ${Emojis.DEVELOPER}
                _Status:_ **${status[this.client.user.presence.status]}**
                _Version:_ **v${version}**
                _Node:_ **[${process.version}](https://nodejs.org/)**
                _Library:_ **[Discord.js v${discordVersion}](https://discord.js.org/)**
                _Created at:_ **${moment(this.client.user.createdAt).format('MMMM D, YYYY HH:mm')}**`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send(embed);
	}

};
