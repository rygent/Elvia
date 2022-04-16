const Event = require('../../Structures/Event');
const { EmbedBuilder } = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');
const { Access, Colors } = require('../../Utils/Constants');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const webhook = new WebhookClient({ url: Access.GuildLogWebhook });
		if (!webhook) return;

		const guildOwner = await guild.fetchOwner();

		const embed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle(`${this.client.user.username} was added to a new Server!`)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ size: 512 }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
			.setDescription([
				`***Server:*** ${guild.name} (\`${guild.id}\`)`,
				`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
				`***Channels:*** ${guild.channels.cache.size.formatNumber()}`,
				`***Members:*** ${guild.memberCount.formatNumber()}`
			].join('\n'))
			.setFooter({ text: `${this.client.guilds.cache.size.formatNumber()} guilds | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL(), embeds: [embed] });
	}

};
