const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'kick',
			description: 'Kick a member with optional reason.',
			memberPerms: ['KICK_MEMBERS'],
			clientPerms: ['KICK_MEMBERS']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('member', true);
		const reason = await interaction.options.getString('reason') || 'No reason provided';

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildId: interaction.guildId });

		await interaction.deferReply({ ephemeral: true });

		if (!member.kickable) return await interaction.editReply({ content: `I can't kicked **${member.displayName}**! For having a higher role than mine!` });
		if (!member.manageable) {
			return await interaction.editReply({ content: 'You can\'t kick a member who has an higher or equal role hierarchy to yours!' });
		}

		return interaction.guild.members.kick(member, { reason }).then(async () => {
			if (!member.user.bot) {
				await member.send({ content: [
					`Hello **${member.user.username}**, You've just been kicked from _${interaction.guild.name}_ by _${interaction.user.tag}_!`,
					`***Reason:*** ${reason}`
				].join('\n') });
			}

			interaction.editReply({ content: [
				`**${member.displayName}** has been successfully kicked from this guild!`,
				`***Reason:*** ${reason}`
			].join('\n') });

			const caseInfo = {
				channel: interaction.channel.id,
				moderator: interaction.user.id,
				date: Date.now(),
				type: 'kick',
				case: guildData.casesCount,
				reason
			};

			memberData.sanctions.push(caseInfo);
			await memberData.save();

			guildData.casesCount++;
			await guildData.save();

			if (guildData.plugins.moderations) {
				const sendChannel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
				if (!sendChannel) return;

				const embed = new MessageEmbed()
					.setColor(Color.RED)
					.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
					.setDescription([
						`***Member:*** ${member.user.tag} (\`${member.user.id}\`)`,
						`***Action:*** Kick`,
						`***Reason:*** ${reason}`
					].join('\n'))
					.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

				return sendChannel.send({ embeds: [embed] });
			}
		});
	}

};
