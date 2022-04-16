const InteractionCommand = require('../../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');
const { Formatters } = require('discord.js');
const { Colors } = require('../../../../Utils/Constants');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: 'serverinfo',
			description: 'Get server information.'
		});
	}

	async run(interaction) {
		const ContentFilterLevel = ['None', 'Scan messages from those without a role', 'Scan all messages'];
		const VerificationLevel = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'];

		const channels = interaction.guild.channels.cache;
		const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setThumbnail(interaction.guild.iconURL({ size: 512 }))
			.setDescription([
				`***ID:*** \`${interaction.guildId}\``,
				`***Owner:*** ${Formatters.userMention(interaction.guild.ownerId)}`,
				`***Boost Status:*** ${interaction.guild.premiumSubscriptionCount} Boosts (\`Level ${interaction.guild.premiumTier}\`)`,
				`***Explicit Filter:*** ${ContentFilterLevel[interaction.guild.explicitContentFilter]}`,
				`***Verification:*** ${VerificationLevel[interaction.guild.verificationLevel]}`,
				`***Created:*** ${Formatters.time(new Date(interaction.guild.createdTimestamp), 'D')} (${Formatters.time(new Date(interaction.guild.createdTimestamp), 'R')})`,
				`***Channels:*** ${channels.filter(({ type }) => ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(type)).size.formatNumber()} Text / ${channels.filter(({ type }) => [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(type)).size.formatNumber()} Voice`,
				`***Online Members:*** ${interaction.guild.members.cache.filter(({ presence }) => ['online', 'idle', 'dnd'].includes(presence?.status)).size.formatNumber()} of ${interaction.guild.memberCount.formatNumber()} Members`
			].join('\n'))
			.addFields({ name: `__Roles__ (${roles.length})`, value: `${roles.length ? this.client.utils.trimArray(roles, 15).join(', ') : 'None'}`, inline: false })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

};
