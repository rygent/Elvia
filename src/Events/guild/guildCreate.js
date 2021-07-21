const Event = require('../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Color, Supports } = require('../../Utils/Configuration.js');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;
		const guildOwner = await guild.fetchOwner();

		const embed = new MessageEmbed()
			.setColor(Color.GREEN)
			.setTitle(`${this.client.user.username} was added to a new Server!`)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ dynamic: true, size: 512 }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
			.setDescription([
				`***Server:*** ${guild.name} (\`${guild.id}\`)`,
				`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
				`***Channels:*** ${guild.channels.cache.size.formatNumber()}`,
				`***Members:*** ${guild.memberCount.formatNumber()}`
			].join('\n'))
			.setFooter(`${this.client.guilds.cache.size.formatNumber()} guilds | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`, this.client.user.avatarURL({ dynamic: true }));

		const sendChannel = this.client.channels.cache.get(Supports.GUILD_LOGS);
		sendChannel.send({ embeds: [embed] });
	}

};
