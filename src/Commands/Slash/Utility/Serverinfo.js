import Command from '../../../Structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types/v10';
import { time, userMention } from 'discord.js';
import { Colors } from '../../../Utils/Constants.js';
import { formatNumber, trimArray } from '../../../Structures/Util.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['serverinfo'],
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
				`***Owner:*** ${userMention(interaction.guild.ownerId)}`,
				`***Boost Status:*** ${interaction.guild.premiumSubscriptionCount} Boosts (\`Level ${interaction.guild.premiumTier}\`)`,
				`***Explicit Filter:*** ${ContentFilterLevel[interaction.guild.explicitContentFilter]}`,
				`***Verification:*** ${VerificationLevel[interaction.guild.verificationLevel]}`,
				`***Created:*** ${time(new Date(interaction.guild.createdTimestamp), 'D')} (${time(new Date(interaction.guild.createdTimestamp), 'R')})`,
				`***Channels:*** ${formatNumber(channels.filter(({ type }) => ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(type)).size)} Text / ${formatNumber(channels.filter(({ type }) => [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(type)).size)} Voice`,
				`***Online Members:*** ${formatNumber(interaction.guild.members.cache.filter(({ presence }) => ['online', 'idle', 'dnd'].includes(presence?.status)).size)} of ${formatNumber(interaction.guild.memberCount)} Members`
			].join('\n'))
			.addFields({ name: `__Roles__ (${roles.length})`, value: `${roles.length ? trimArray(roles, 15).join(', ') : 'None'}`, inline: false })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed] });
	}

}
