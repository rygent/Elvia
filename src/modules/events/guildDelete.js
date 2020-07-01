const Event = require('../../structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Clients } = require('../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${this.client.user.username} left a server.`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription(stripIndents`
				***Server:*** ${guild.name} (${guild.id})
				***Owner:*** ${guild.owner.user.tag} (${guild.ownerID})
			`);

		const sendChannel = this.client.channels.cache.get(Clients.GUILD_LOGS);
		sendChannel.send(embed);
	}

};
