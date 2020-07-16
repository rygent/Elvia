const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Add an emoji to the server!',
			category: 'administration',
			usage: '<URL> <name>',
			memberPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_GUILD', 'MANAGE_EMOJIS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [url, name]) {
		if (!url || !url.startsWith('http')) {
			return this.client.embeds.common('commonError', message, 'Please provide a URL of the emoji!');
		}

		if (!name) {
			return this.client.embeds.common('commonError', message, 'Please provide a name of the emoji!');
		}

		message.guild.emojis.create(url, name).then(emote => {
			this.client.embeds.common('commonSuccess', message, `Emoji **${emote.name}** added to the server! String: \`${emote.toString()}\``);
		}).catch(() => this.client.embeds.common('commonError', message, 'The URL image is invalid or you don\'t have more space on your server!'));
	}

};
