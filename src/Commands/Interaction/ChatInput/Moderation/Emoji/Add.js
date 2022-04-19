const InteractionCommand = require('../../../../../Structures/Interaction');
const { Util } = require('discord.js');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'add'],
			description: 'Add an emoji to the server.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const name = await interaction.options.getString('name', true);
		const emoji = await interaction.options.getString('emoji', true);

		const regex = RegExp(/(https?:\/\/[^\s]+)/g);

		const parseEmoji = Util.parseEmoji(emoji);

		try {
			let emojis;
			if (emoji.match(regex)) {
				emojis = await interaction.guild.emojis.create(emoji, name);
			} else if (parseEmoji.id) {
				const link = `https://cdn.discordapp.com/emojis/${parseEmoji.id}.${parseEmoji.animated ? 'gif' : 'png'}`;
				emojis = await interaction.guild.emojis.create(link, name);
			}

			return interaction.reply({ content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully added.` });
		} catch {
			return interaction.reply({ content: 'The emoji are invalid or you don\'t have more space on your server!', ephemeral: true });
		}
	}

};
