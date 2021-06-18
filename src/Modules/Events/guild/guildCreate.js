const Event = require('../../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Supports } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const embed = new MessageEmbed()
			.setColor(Colors.GREEN)
			.setTitle(`${this.client.user.username} joined a new server!`)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Server:*** ${guild.name}`,
				`***ID:*** \`${guild.id}\``,
				`***Owner:*** <@${guild.ownerID}>`,
				`***Channels:*** ${guild.channels.cache.size}`,
				`***Members:*** ${guild.memberCount}`
			].join('\n'));

		const sendChannel = this.client.channels.cache.get(Supports.GUILD_LOGS);
		sendChannel.send(embed);

		const directEmbed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle(`Thanks for choosing ${this.client.user.username}!`)
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription([
				`Hello <@${guild.ownerID}>,`,
				`You can use \`${this.client.prefix}help\` to see all commands of the bot\n`,
				`If you need any help you can join our [discord server](https://discord.gg/nW6x9EN)`
			].join('\n'));

		const sendOwner = this.client.users.cache.get(guild.ownerID);
		sendOwner.send(directEmbed);
	}

};
