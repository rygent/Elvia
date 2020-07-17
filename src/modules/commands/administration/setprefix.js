const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pfx', 'prefixes', 'guildprefix'],
			description: 'Displays prefix or set the server\'s prefix.',
			category: 'administration',
			usage: '<prefix>',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	// eslint-disable-next-line consistent-return
	async run(message, [prefix], data) {
		const banned = ['#', '@', '`'];

		if (!prefix) return this.client.embeds.common('commonError', message, 'You must provide a valid prefix to set.');
		if (banned.includes(prefix)) return this.client.embeds.common('commonError', message, 'This prefix is unavailable. It may be a markdown character.');
		if (prefix.length > 5) return this.client.embeds.common('commonError', message, 'The prefix must not exceed 5 characters!');

		data.guild.prefix = prefix;
		data.guild.save();

		this.client.embeds.common('commonSuccess', message, `The prefix has been changed to "**${prefix}**". If you ever forget the prefix just tag me!`);
	}

};
