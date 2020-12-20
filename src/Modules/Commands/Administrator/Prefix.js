const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pfx', 'prefixes', 'guildprefix'],
			description: 'Changes the server prefix',
			category: 'Administrator',
			usage: '<prefix>',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	async run(message, [prefix]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		const banned = ['#', '@', '`'];

		if (!prefix) return message.quote('You must provide a valid prefix to set.');
		if (banned.includes(prefix)) return message.quote('This prefix is unavailable. It may be a markdown character.');
		if (prefix.length > 5) return message.quote('The prefix must not exceed 5 characters!');

		guildData.prefix = prefix;
		guildData.save();

		return message.quote(`The prefix has been changed to "**${guildData.prefix}**". If you ever forget the prefix just tag me!`);
	}

};
