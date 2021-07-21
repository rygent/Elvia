const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pfx', 'prefixes', 'guildprefix'],
			description: 'Change prefix on the server.',
			category: 'Administrator',
			usage: '[prefix]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [prefix]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		const banned = ['#', '@', '`'];

		if (!prefix) return message.reply({ content: 'You must define a valid prefix to change it!' });
		if (banned.includes(prefix)) return message.reply({ content: 'This prefix is not available, because it contains a markdown character!' });
		if (prefix.length > 5) return message.reply({ content: 'The prefix cannot be longer than 5 characters!' });

		guildData.prefix = prefix;
		guildData.save();

		return message.reply({ content: `The prefix has been changed to \`${guildData.prefix}\`.\nIf you forget the prefix just mention me!` });
	}

};
