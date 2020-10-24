const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const perms = require('../../../../assets/json/permissions.json');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['uinfo', 'userinfo', 'whois'],
			description: 'Displays information about the mentioned user.',
			category: 'utility',
			usage: '[mention|id]',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, [target]) {
		const member = this.client.functions.getMember(message, target);
		const roles = member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role.id !== message.guild.id).map(role => role.toString()).join(' ') || 'None';

		const status = {
			online: `${Emojis.ONLINE} Online`,
			idle: `${Emojis.IDLE} Idle`,
			dnd: `${Emojis.DND} Do Not Disturb`,
			offline: `${Emojis.OFFLINE} Offline`
		};

		const flags = {
			DISCORD_EMPLOYEE: 'Discord Employee',
			DISCORD_PARTNER: 'Discord Partner',
			BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
			BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
			HYPESQUAD_EVENTS: 'HypeSquad Events',
			HOUSE_BRAVERY: 'House of Bravery',
			HOUSE_BRILLIANCE: 'House of Brilliance',
			HOUSE_BALANCE: 'House of Balance',
			EARLY_SUPPORTER: 'Early Supporter',
			TEAM_USER: 'Team User',
			SYSTEM: 'System',
			VERIFIED_BOT: 'Verified Bot',
			VERIFIED_DEVELOPER: 'Verified Bot Developer'
		};

		/* eslint-disable-next-line no-shadow */ /* eslint-disable-next-line no-unused-vars */
		const allowed = Object.entries(member.permissions.serialize()).filter(([perm, allowed]) => allowed).map(([perm]) => `${perms[perm]}`).join(', ');

		const userFlags = member.user.flags.toArray();

		let platforms;
		const plat = member.user.presence.clientStatus;
		if (plat === null) {
			platforms = '';
		} else if (plat.mobile) {
			platforms = '(Mobile)';
		} else if (plat.desktop) {
			platforms = '(Desktop)';
		} else if (plat.web) {
			platforms = '(Web)';
		}

		const embed = new MessageEmbed()
			.setColor(member.displayHexColor === '#000000' ? Colors.DEFAULT : member.displayHexColor)
			.setAuthor(`User Information for ${member.nickname || member.user.username}`, member.user.avatarURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription(stripIndents`
                ***Username:*** ${member.user.tag} ${member.user.bot ? Emojis.BOT : ''}
                ***ID:*** ${member.id}
                ***Nickname:*** ${member.nickname || 'None.'}
                ***Flags:*** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None.'}
                ***Avatar:*** [Link to Avatar](${member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})
				***Status:*** ${status[member.user.presence.status]} ${platforms}
				***Activity:*** ${member.user.presence.activities.length > 0 ? member.user.presence.activities.join(', ') : 'No Activity.'}
				***Created:*** ${moment(member.user.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(member.user.createdTimestamp).fromNow()})
				***Joined:*** ${moment(member.joinedAt).format('MMMM D, YYYY HH:mm')} (${moment(member.joinedAt).fromNow()})
			`)
			.addField(`__Roles [${member.roles.cache.filter(role => role.name !== '@everyone').size}]__`, stripIndents`
                ***Highest:*** ${member.roles.highest ? member.roles.highest : 'None'}
                ***List:*** ${roles}`)
			.addField('__Permissions__', allowed || 'None')
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
