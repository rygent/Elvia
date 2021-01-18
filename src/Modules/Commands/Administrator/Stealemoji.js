const Command = require('../../../Structures/Command.js');
const { Util } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Steal an emoji from a different server',
			category: 'Administrator',
			usage: '<emoji> [name]',
			userPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [emoji, name]) {
		if (!emoji) return message.quote('Please provide a Emoji or URL of the emoji!');

		try {
			if (emoji.startsWith('https://cdn.discordapp.com')) {
				if (!name) return message.quote('Please provide a name of the emoji!');

				await message.guild.emojis.create(emoji, name).then(emote => {
					message.quote(`Emoji has been added as **${emote.name}** \`${emote.toString()}\``);
				});
			}

			const customEmoji = Util.parseEmoji(emoji);
			if (customEmoji.id) {
				const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji.animated ? 'gif' : 'png'}`;

				await message.guild.emojis.create(link, name || customEmoji.name).then(emote => {
					message.quote(`Emoji has been added as **${emote.name}** \`${emote.toString()}\``);
				});
			}
		} catch (err) {
			return message.quote('The Emoji is invalid or you don\'t have more space on your server!');
		}
	}

};
