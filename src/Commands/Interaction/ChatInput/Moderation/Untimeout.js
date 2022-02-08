const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'untimeout',
			description: 'Remove timeout from a member.',
			memberPerms: ['MODERATE_MEMBERS'],
			clientPerms: ['MODERATE_MEMBERS']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('member', true);
		const reason = await interaction.options.getString('reason');

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		if (!member.moderatable) return interaction.reply({ content: 'You cannot remove a timeout from a member who has a higher or equal role than yours.', ephemeral: true });
		if (!member.moderatable) return interaction.reply({ content: `I cannot remove a timeout from a member who has a higher or equal role than mine.`, ephemeral: true });

		await member.timeout(null, `${reason ? `${reason} (Time out removed by ${interaction.user.tag})` : `(Time out removed by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		interaction.reply({ content: [
			`**${member.user.tag}** is no longer timed out!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });

		if (guildData.plugins.moderations) {
			const channel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
			if (!channel) return;

			const embed = new MessageEmbed()
				.setColor(Color.GREEN)
				.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription([
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Action:*** Removed timeout`,
					`***Reason:*** ${reason || 'None specified'}`
				].join('\n'))
				.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

			return channel.send({ embeds: [embed] });
		}
	}

};
