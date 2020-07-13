const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pfx', 'prefixes', 'guildprefix'],
			description: 'Displays prefix or set the server\'s prefix.',
			category: 'administration',
			usage: 'set <prefix>',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['SEND_MESSAGES', 'MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, [mode, prefix], data) {
		const banned = ['#', '@', '`'];

		const prefixes = data.guild ? data.guild.prefix : this.client.prefix;
		if (!mode || mode !== 'set') return message.channel.send(`My prefix for this guild is \`${prefixes}\`.`);

		if (mode === 'set') {
			if (!prefix) return message.channel.send('You must provide a valid prefix to set.');
			if (banned.includes(prefix)) return message.channel.send('This prefix is unavailable. It may be a markdown character.');
			if (prefix.length > 5) return message.channel.send('The prefix must not exceed 5 characters!');

			data.guild.prefix = prefix;
			data.guild.save();

			message.channel.send(`The prefix has been changed to "**${prefix}**". If you ever forget the prefix just tag me!`);
		}
	}

};
