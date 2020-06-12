const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'addemote',
			aliases: [],
			description: 'Add an emoji to the server!',
			category: 'administrator',
			usage: '<URL> <name>',
			guildOnly: true,
			memberPerms: ['ADMINISTRATOR'],
			clientPerms: ['SEND_MESSAGES', 'MANAGE_EMOJIS']
		});
	}

	async run(message, args) {
		const url = args[0];
		if (!url) {
			message.channel.send('Please indicate the url of the emoji!');
			return;
		}

		const name = args[1];
		if (!name) {
			message.channel.send('Please indicate the name of the emoji!');
			return;
		}

		message.guild.emojis.create(url, name).then(emote => {
			message.channel.send(`Emoji **${emote.name}** added to the server! String: \`${emote.toString()}\``);
		}).catch(() => {
			message.channel.send('The URL to the image is invalid or you have no more space on your Discord!');
			return;
		});
	}

};
