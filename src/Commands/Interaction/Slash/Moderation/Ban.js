const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ban',
			description: 'Ban a user with optional reason.',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['BAN_MEMBERS']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user', true);
		const reason = await interaction.options.getString('reason') || 'No reason provided';
		const days = await interaction.options.getInteger('days');

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildId: interaction.guildId });

		await interaction.deferReply({ ephemeral: true });

		if (!member.bannable) return await interaction.editReply({ content: `I can't banned **${member.displayName}**! For having a higher role than mine!` });
		if (!member.manageable) {
			return await interaction.editReply({ content: 'You can\'t ban a member who has an higher or equal role hierarchy to yours!' });
		}

		return interaction.guild.members.ban(member, { days, reason }).then(async () => {
			if (!member.user.bot) {
				await member.send({ content: [
					`Hello **${member.user.username}**, You've just been banned from _${interaction.guild.name}_ by _${interaction.user.tag}_!`,
					`***Reason:*** ${reason}`
				].join('\n') });
			}

			interaction.editReply({ content: [
				`**${member.displayName}** has been successfully banned from this guild!`,
				`***Reason:*** ${reason}`
			].join('\n') });

			const caseInfo = {
				channel: interaction.channel.id,
				moderator: interaction.user.id,
				date: Date.now(),
				type: 'ban',
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
						`***Action:*** Ban`,
						`***Reason:*** ${reason}`
					].join('\n'))
					.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

				return sendChannel.send({ embeds: [embed] });
			}
		});
	}

};
