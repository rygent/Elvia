const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['serverinfo', 'guild', 'guildinfo'],
			description: 'Shows about the current server information.',
			category: 'Utilities',
			cooldown: 5000
		});
	}

	async run(message) {
		const verificationLevels = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

		const contentFilterLevels = {
			DISABLED: 'None',
			MEMBERS_WITHOUT_ROLES: 'Scan messages from those without a role',
			ALL_MEMBERS: 'Scan all messages'
		};

		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.name).slice(0, -1);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Server Information for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Name:*** ${message.guild.name}`,
				`***ID:*** \`${message.guild.id}\``,
				`***Owner:*** <@${message.guild.ownerId}>`,
				`***Boost Tier:*** ${message.guild.premiumTier.toProperCase()}`,
				`***Explicit filter:*** ${contentFilterLevels[message.guild.explicitContentFilter]}`,
				`***Verification:*** ${verificationLevels[message.guild.verificationLevel]}`,
				`***Registered:*** ${moment(message.guild.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(message.guild.createdTimestamp).fromNow()})`
			].join('\n'))
			.addField('__Channels__', [
				`***Categories:*** ${message.guild.channels.cache.filter(ch => ch.type === 'category').size}`,
				`***Text:*** ${message.guild.channels.cache.filter(ch => ch.type === 'text').size}`,
				`***Voice:*** ${message.guild.channels.cache.filter(ch => ch.type === 'voice').size}`,
				`***AFK:*** ${message.guild.afkChannel ? message.guild.afkChannel.name : 'None'}`
			].join('\n'), true)
			.addField('__Users__', [
				`***Humans:*** ${message.guild.memberCount - message.guild.members.cache.filter(mbr => mbr.user.bot).size}`,
				`***Bots:*** ${message.guild.members.cache.filter(mbr => mbr.user.bot).size}`,
				`***Members:*** ${message.guild.memberCount}`
			].join('\n'), true)
			.addField('__Others__', `***Booster:*** ${message.guild.premiumSubscriptionCount}`, true)
			.addField(`__Roles__`, `${roles.length < 15 ? roles.join(', ') : roles.length > 15 ? this.client.utils.trimArray(roles, 15).join(', ') : 'None'}`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
