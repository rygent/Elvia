const Event = require('../../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Supports } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${this.client.user.username} left a server.`)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
			.setDescription([
				`***Server:*** ${guild.name}`,
				`***ID:*** \`${guild.id}\``,
				`***Owner:*** <@${guild.ownerID}>`
			].join('\n'));

		const sendChannel = this.client.channels.cache.get(Supports.GUILD_LOGS);
		sendChannel.send(embed);
	}

};
