const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Add an emoji to the server!',
			category: 'Administrator',
			usage: '<URL> <name>',
			userPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS']
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [url, name]) {
		if (!url || !url.startsWith('http')) {
			return message.quote('Please provide a URL of the emoji!');
		}

		if (!name) {
			return message.quote('Please provide a name of the emoji!');
		}

		message.guild.emojis.create(url, name).then(emote => {
			message.quote(`Emoji **${emote.name}** added to the server! String: \`${emote.toString()}\``);
		}).catch(() => message.quote('The URL image is invalid or you don\'t have more space on your server!'));
	}

};
