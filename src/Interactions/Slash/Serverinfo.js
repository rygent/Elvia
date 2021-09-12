const Interaction = require('../../Structures/Interaction.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'serverinfo',
			description: 'Gets server information'
		});
	}

	async run(interaction) {
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

		const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.name).slice(0, -1);

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
			.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${interaction.guildId}\``,
				`***Owner:*** ${Formatters.memberNicknameMention(interaction.guild.ownerId)}`,
				`***Boost Tier:*** ${interaction.guild.premiumTier.replace(/_/g, ' ').toProperCase()}`,
				`***Explicit filter:*** ${contentFilterLevels[interaction.guild.explicitContentFilter]}`,
				`***Verification:*** ${verificationLevels[interaction.guild.verificationLevel]}`,
				`***Created:*** ${Formatters.time(new Date(interaction.guild.createdTimestamp))} (${moment(interaction.guild.createdTimestamp).fromNow()})`
			].join('\n'))
			.addField('__Channels__', [
				`***Categories:*** ${interaction.guild.channels.cache.filter(x => x.type === 'GUILD_CATEGORY').size}`,
				`***Text:*** ${interaction.guild.channels.cache.filter(x => x.type === 'GUILD_TEXT').size}`,
				`***Voice:*** ${interaction.guild.channels.cache.filter(x => x.type === 'GUILD_VOICE').size}`,
				`***AFK:*** ${interaction.guild.afkChannel ? interaction.guild.afkChannel.name : 'None'}`
			].join('\n'), true)
			.addField('__Users__', [
				`***Humans:*** ${interaction.guild.memberCount - interaction.guild.members.cache.filter(x => x.user.bot).size}`,
				`***Bots:*** ${interaction.guild.members.cache.filter(x => x.user.bot).size}`,
				`***Members:*** ${interaction.guild.memberCount}`
			].join('\n'), true)
			.addField('__Others__', `***Booster:*** ${interaction.guild.premiumSubscriptionCount}`, true)
			.addField(`__Roles__`, `${roles.length < 15 ? roles.join(', ') : roles.length > 15 ? this.client.utils.trimArray(roles, 15).join(', ') : 'None'}`)
			.setFooter(`${interaction.user.username}  •  Powered by ${this.client.user.username}`, interaction.user.avatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
