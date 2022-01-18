const Interaction = require('../../../../Structures/Interaction.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');
const { uid } = require('uid');

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
		const reason = await interaction.options.getString('reason');
		const days = await interaction.options.getInteger('days');

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		if (!member.bannable) return interaction.reply({ content: `I can't banned **${member.displayName}**! For having a higher role than mine!`, ephemeral: true });
		if (!member.manageable) {
			return interaction.reply({ content: 'You can\'t ban a member who has an higher or equal role hierarchy to yours!', ephemeral: true });
		}

		await member.ban({ days, reason: `${reason ? `${reason} (Banned by ${interaction.user.tag})` : `(Banned by ${interaction.user.tag})`}` });

		const uniqueId = uid(24);

		guildData.casesCount++;
		await guildData.save();

		interaction.reply({ content: [
			`**${member.user.tag}** was banned!`,
			`${reason ? `\n>>> ***Reason:*** ${reason}` : ''}`
		].join('') });

		if (guildData.plugins.moderations) {
			const channel = interaction.guild.channels.cache.get(guildData.plugins.moderations);
			if (!channel) return;

			const embed = new MessageEmbed()
				.setColor(Color.RED)
				.setAuthor({ name: `Actioned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setDescription([
					`***ID:*** \`${uniqueId}\``,
					`***User:*** ${member.user.tag} (\`${member.user.id}\`)`,
					`***Action:*** Ban`,
					`***Reason:*** ${reason || 'None specified'}`,
					`***Date:*** ${Formatters.time(new Date(Date.now()))}`
				].join('\n'))
				.setFooter({ text: `Powered by ${this.client.user.username}  •  Case #${guildData.casesCount}`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

			return channel.send({ embeds: [embed] });
		}
	}

};
