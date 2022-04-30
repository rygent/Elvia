const InteractionCommand = require('../../../../Structures/Interaction');
const { Attachment, Util } = require('discord.js');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'image'],
			description: 'Get the full size image of an emoji.'
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);

		const parseEmoji = Util.parseEmoji(emoji);
		const emojis = await interaction.guild.emojis.cache.get(parseEmoji.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const buffer = `https://cdn.discordapp.com/emojis/${emojis.id}.${emojis.animated ? 'gif' : 'png'}`;
		const attachment = new Attachment(buffer);

		return interaction.reply({ files: [attachment] });
	}

};
