const Event = require('../../../Structures/Event.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { Access, Colors } = require('../../../Structures/Configuration.js');
const webhook = new WebhookClient(Access.WEBHOOK_ID, Access.WEBHOOK_TOKEN);

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;
		const guildOwner = await guild.fetchOwner();

		const embed = new MessageEmbed()
			.setColor(Colors.GREEN)
			.setTitle(`${this.client.user.username} was added to a new Server!`)
			.setThumbnail(guild.iconURL() ? guild.iconURL({ dynamic: true, size: 512 }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
			.setDescription([
				`***Server:*** ${guild.name} (\`${guild.id}\`)`,
				`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
				`***Channels:*** ${guild.channels.cache.size.formatNumber()}`,
				`***Members:*** ${guild.memberCount.formatNumber()}`
			].join('\n')) // eslint-disable-next-line max-len
			.setFooter(`${this.client.guilds.cache.size.formatNumber()} guilds | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`, this.client.user.displayAvatarURL({ dynamic: true }));

		webhook.send({ username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ dynamic: true }), embeds: [embed] });

		const directEmbed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle(`Thanks for choosing ${this.client.user.username}!`)
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`Hello <@${guildOwner.id}>,`,
				`You can use \`${this.client.prefix}help\` to see all commands of the bot\n`,
				`If you need any help you can join our [discord server](https://discord.gg/nW6x9EN)`
			].join('\n'));

		guildOwner.send({ embeds: [directEmbed] });
	}

};
