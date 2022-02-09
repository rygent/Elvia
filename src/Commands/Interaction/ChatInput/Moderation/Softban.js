const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'softban',
			description: 'Softban a user. (Bans and unbans to clear up the user\'s messages.)',
			memberPermission: ['BAN_MEMBERS'],
			clientPermission: ['BAN_MEMBERS']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user', true);
		const reason = await interaction.options.getString('reason');
		const days = await interaction.options.getInteger('days') || 1;

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		if (!member.bannable) return interaction.reply({ content: `I can't softbanned **${member.displayName}**! For having a higher role than mine!`, ephemeral: true });
		if (!member.manageable) {
			return interaction.reply({ content: 'You can\'t softban a member who has an higher or equal role hierarchy to yours!', ephemeral: true });
		}

		await member.ban({ days, reason: `${reason ? `${reason} (Softbanned by ${interaction.user.tag})` : `(Softbanned by ${interaction.user.tag})`}` });
		await interaction.guild.members.unban(member, `${reason ? `${reason} (Softbanned by ${interaction.user.tag})` : `(Softbanned by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		interaction.reply({ content: [
			`**${member.user.tag}** was softbanned!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });

		if (guildData.plugins.moderations) {
			const channel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
			if (!channel) return;

			const embed = new MessageEmbed()
				.setColor(Color.ORANGE)
				.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription([
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Action:*** Softban`,
					`***Reason:*** ${reason || 'None specified'}`
				].join('\n'))
				.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

			return channel.send({ embeds: [embed] });
		}
	}

};
