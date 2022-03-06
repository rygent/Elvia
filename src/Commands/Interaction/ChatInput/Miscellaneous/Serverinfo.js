const Interaction = require('../../../../Structures/Interaction');
const { Formatters, MessageEmbed } = require('discord.js');
const { ChannelType } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'serverinfo',
			description: 'Get server information.'
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

		const boostLevel = {
			NONE: 'Level 0',
			TIER_1: 'Level 1',
			TIER_2: 'Level 2',
			TIER_3: 'Level 3'
		};

		const channels = interaction.guild.channels.cache;
		const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
			.setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***ID:*** \`${interaction.guildId}\``,
				`***Owner:*** ${Formatters.memberNicknameMention(interaction.guild.ownerId)}`,
				`***Boost Status:*** ${interaction.guild.premiumSubscriptionCount} Boosts (\`${boostLevel[interaction.guild.premiumTier]}\`)`,
				`***Explicit Filter:*** ${contentFilterLevels[interaction.guild.explicitContentFilter]}`,
				`***Verification:*** ${verificationLevels[interaction.guild.verificationLevel]}`,
				`***Created:*** ${Formatters.time(new Date(interaction.guild.createdTimestamp), 'D')} (${Formatters.time(new Date(interaction.guild.createdTimestamp), 'R')})`,
				`***Channels:*** ${channels.filter(channel => ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type)).size.toLocaleString()} Text / ${channels.filter(channel => [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type)).size.toLocaleString()} Voice`,
				`***Online Members:*** ${interaction.guild.members.cache.filter(members => ['online', 'idle', 'dnd'].includes(members.presence?.status)).size.toLocaleString()} of ${interaction.guild.memberCount.toLocaleString()} Members`
			].join('\n'))
			.addField(`__Roles__ (${roles.length})`, `${roles.length > 0 ? this.client.utils.formatArray(this.client.utils.trimArray(roles, 15)) : 'None'}`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed] });
	}

};
