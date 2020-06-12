const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'server',
			aliases: ['serverinfo', 'guild'],
			description: 'Displays information about the current server.',
			category: 'information',
			guildOnly: true
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

		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setAuthor(`Server Information for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.addField('Details', stripIndents`
                _Name:_ **${message.guild.name}**
                _ID:_ **${message.guild.id}**
                _Owner:_ **${message.guild.owner.user.tag}**
                _Region:_ **${region[message.guild.region]}**
                _Boost Tier:_ **${message.guild.premiumTier ? `Tier: ${message.guild.premiumTier}` : 'None'}**
                _Explicit filter:_ **${contentFilterLevels[message.guild.explicitContentFilter]}**
                _Verification:_ **${verificationLevels[message.guild.verificationLevel]}**
                _Created:_ **${moment(message.guild.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(message.guild.createdTimestamp).fromNow()})**`)
			.addField('Channels', stripIndents`
                _Categories:_ **${message.guild.channels.cache.filter(ch => ch.type === 'category').size}**
                _Text:_ **${message.guild.channels.cache.filter(ch => ch.type === 'text').size}**
                _Voice:_ **${message.guild.channels.cache.filter(ch => ch.type === 'voice').size}**
                _AFK:_ **${message.guild.afkChannel ? message.guild.afkChannel.name : 'None'}**`, true)
			.addField('Users', stripIndents`
                _Humans:_ **${message.guild.memberCount - message.guild.members.cache.filter(mbr => mbr.user.bot).size}**
                _Bots:_ **${message.guild.members.cache.filter(mbr => mbr.user.bot).size}**
                _Members:_ **${message.guild.memberCount}**`, true)
			.addField('Others', stripIndents`
                _Booster:_ **${message.guild.premiumSubscriptionCount}**`)
			.addField(`__**Roles [${message.guild.roles.cache.filter(fil => fil.name !== '@everyone').size}]**__`, stripIndents`
                ${message.guild.roles.cache.sort((a, b) => b.position - a.position).filter(fil => fil.name !== '@everyone').map(re => re.name).join(', ')}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send(embed);
	}

};
