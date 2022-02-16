const Event = require('../../Structures/Event');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { Access, Colors } = require('../../Utils/Constants');
const webhook = new WebhookClient({ url: Access.GuildLogWebhook });

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;
		if (!webhook) return;

		const guildOwner = await guild.fetchOwner();

		const embed = new MessageEmbed()
			.setColor(Colors.Green)
			.setTitle(`${this.client.user.username} was added to a new Server!`)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ dynamic: true, size: 512 }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
			.setDescription([
				`***Server:*** ${guild.name} (\`${guild.id}\`)`,
				`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
				`***Channels:*** ${guild.channels.cache.size.toLocaleString()}`,
				`***Members:*** ${guild.memberCount.toLocaleString()}`
			].join('\n'))
			.setFooter({ text: `${this.client.guilds.cache.size.toLocaleString()} guilds | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} users`, iconURL: this.client.user.avatarURL({ dynamic: true }) });

		return webhook.send({ username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ dynamic: true }), embeds: [embed] });
	}

};
