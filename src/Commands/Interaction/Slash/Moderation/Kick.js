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
		const reason = await interaction.options.getString('reason');

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		if (!member.kickable) return interaction.reply({ content: `I can't kicked **${member.displayName}**! For having a higher role than mine!`, ephemeral: true });
		if (!member.manageable) {
			return interaction.reply({ content: 'You can\'t kick a member who has an higher or equal role hierarchy to yours!', ephemeral: true });
		}

		await member.kick(`${reason ? `${reason} (Kicked by ${interaction.user.tag})` : `(Kicked by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		interaction.reply({ content: [
			`**${member.user.tag}** was kicked!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });

		if (guildData.plugins.moderations) {
			const channel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
			if (!channel) return;

			const embed = new MessageEmbed()
				.setColor(Color.ORANGE)
				.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription([
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Action:*** Kick`,
					`***Reason:*** ${reason || 'None specified'}`
				].join('\n'))
				.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

			return channel.send({ embeds: [embed] });
		}
	}

};
