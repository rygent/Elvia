const Event = require('../../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${this.client.user.username} left a server.`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription([
				`***Server:*** ${guild.name} (${guild.id})`,
				`***Owner:*** ${guild.owner.user.tag} (${guild.ownerID})`
			].join('\n'));

		// eslint-disable-next-line no-process-env
		const sendChannel = this.client.channels.cache.get(process.env.GUILD_LOGS);
		sendChannel.send(embed);
	}

};
