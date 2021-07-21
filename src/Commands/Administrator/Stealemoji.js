const Command = require('../../Structures/Command.js');
const { Util } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Steal emojis from other servers.',
			category: 'Administrator',
			usage: '[emoji] (name)',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_EMOJIS_AND_STICKERS']
		});
	}

	async run(message, [emoji, name]) {
		if (!emoji) return message.reply({ content: 'You have to provide an emoji or url of the emoji!' });

		try {
			if (emoji.startsWith('https://cdn.discordapp.com')) {
				if (!name) return message.reply({ content: 'Please specify a name for the emoji!' });

				await message.guild.emojis.create(emoji, name).then((emote) => {
					message.reply({ content: `Emojis have been added as **${emote.name}** \`${emote.toString()}\`` });
				});
			}

			const customEmoji = Util.parseEmoji(emoji);
			if (customEmoji.id) {
				const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji.animated ? 'gif' : 'png'}`;

				await message.guild.emojis.create(link, name || customEmoji.name).then((emote) => {
					message.reply({ content: `Emojis have been added as **${emote.name}** \`${emote.toString()}\`` });
				});
			}
		} catch {
			return message.reply({ content: 'The emoji are invalid or you don\'t have more space on your server!' });
		}
	}

};
