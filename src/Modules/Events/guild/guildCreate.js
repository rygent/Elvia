const Event = require('../../../Structures/Event.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Event {

	async run(guild) {
		if (!guild.available) return;

		const embed = new MessageEmbed()
			.setColor(Colors.GREEN)
			.setTitle(`${this.client.user.username} joined a new server!`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription([
				`***Server:*** ${guild.name} (${guild.id})`,
				`***Owner:*** ${guild.owner.user.tag} (${guild.ownerID})`,
				`***Channels:*** ${guild.channels.cache.size}`,
				`***Members:*** ${guild.memberCount}`
			].join('\n'));

		// eslint-disable-next-line no-process-env
		const sendChannel = this.client.channels.cache.get(process.env.GUILD_LOGS);
		sendChannel.send(embed);

		const directEmbed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setTitle(`Thanks for choosing ${this.client.user.username}!`)
			.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.setDescription([
				`Hello <@${guild.owner.user.id}>,`,
				`You can use \`${this.client.prefix}help\` to see all commands of the bot\n`,
				`If you need any help you can join our [discord server](https://discord.gg/nW6x9EN)`
			].join('\n'))
			.setTimestamp();

		guild.owner.send(directEmbed);
	}

};
