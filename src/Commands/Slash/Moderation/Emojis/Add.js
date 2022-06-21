const Command = require('../../../../Structures/Interaction');
const { parseEmoji } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emojis', 'add'],
			description: 'Add an emoji to the server.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const name = await interaction.options.getString('name', true);
		const emoji = await interaction.options.getString('emoji', true);

		const regex = RegExp(/(https?:\/\/[^\s]+)/g);

		const parse = parseEmoji(emoji);

		try {
			let emojis;
			if (emoji.match(regex)) {
				emojis = await interaction.guild.emojis.create({ attachment: emoji, name });
			} else if (parse.id) {
				const link = `https://cdn.discordapp.com/emojis/${parse.id}.${parse.animated ? 'gif' : 'png'}`;
				emojis = await interaction.guild.emojis.create({ attachment: link, name });
			}

			return interaction.reply({ content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully added.` });
		} catch {
			return interaction.reply({ content: 'The emoji are invalid or you don\'t have more space on your server!', ephemeral: true });
		}
	}

};
