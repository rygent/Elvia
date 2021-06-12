const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
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
		const region = {
			brazil: ':flag_br: Brazil',
			europe: ':flag_eu: Europe',
			hongkong: ':flag_hk: Hong Kong',
			india: ':flag_in: India',
			japan: ':flag_jp: Japan',
			russia: ':flag_ru: Russia',
			singapore: ':flag_sg: Singapore',
			southafrica: ':flag_za: South Africa',
			sydney: ':flag_au: Sydney',
			'us-central': ':flag_us: U.S. Central',
			'us-east': ':flag_us: U.S. East',
			'us-south': ':flag_us: U.S. South',
			'us-west': ':flag_us: U.S. West'
		};

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
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor(`Server Information for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription([
				`***Name:*** ${message.guild.name}`,
				`***ID:*** \`${message.guild.id}\``,
				`***Owner:*** <@${message.guild.ownerID}>`,
				`***Region:*** ${region[message.guild.region]}`,
				`***Boost Tier:*** ${message.guild.premiumTier ? `Tier: ${message.guild.premiumTier}` : 'None'}`,
				`***Explicit filter:*** ${contentFilterLevels[message.guild.explicitContentFilter]}`,
				`***Verification:*** ${verificationLevels[message.guild.verificationLevel]}`,
				`***Created:*** ${moment(message.guild.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(message.guild.createdTimestamp).fromNow()})`
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
			.addField('__Others__', [
				`***Booster:*** ${message.guild.premiumSubscriptionCount}`
			], true)
			.addField(`__Roles__`, [
				`${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles).join(', ') : 'None'}`
			])
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send(embed);
	}

};
