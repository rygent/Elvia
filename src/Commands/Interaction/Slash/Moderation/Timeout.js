const Interaction = require('../../../../Structures/Interaction.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');
const ms = require('ms');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'timeout',
			description: 'Timeout a member with duration and optional reason.',
			memberPerms: ['MODERATE_MEMBERS'],
			clientPerms: ['MODERATE_MEMBERS']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('member', true);
		const duration = await interaction.options.getString('duration', true);
		const reason = await interaction.options.getString('reason');

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });
		const parsed = ms(duration);

		if (!member.moderatable) return interaction.reply({ content: `I can't timed out **${member.displayName}**! For having a higher role than mine!`, ephemeral: true });
		if (!member.manageable) {
			return interaction.reply({ content: 'You can\'t timed out a member who has an higher or equal role hierarchy to yours!', ephemeral: true });
		}

		await member.timeout(parsed, `${reason ? `${reason} (Timed out by ${interaction.user.tag})` : `(Timed out by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		interaction.reply({ content: [
			`**${member.user.tag}** was timed out!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`,
			`\n***Expiration:*** ${Formatters.time(new Date(Date.now() + parsed), 'R')}`
		].join('') });

		if (guildData.plugins.moderations) {
			const channel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
			if (!channel) return;

			const embed = new MessageEmbed()
				.setColor(Color.GREY)
				.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription([
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Action:*** Timeout`,
					`***Reason:*** ${reason || 'None specified'}`,
					`***Expiration:*** ${Formatters.time(new Date(Date.now() + parsed), 'R')}`
				].join('\n'))
				.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

			return channel.send({ embeds: [embed] });
		}
	}

};
