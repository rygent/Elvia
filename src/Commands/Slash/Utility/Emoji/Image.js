const Command = require('../../../../Structures/Interaction');
const { AttachmentBuilder, parseEmoji } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'image'],
			description: 'Get the full size image of an emoji.'
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);

		const parse = parseEmoji(emoji);
		const emojis = await interaction.guild.emojis.cache.get(parse.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const attachment = new AttachmentBuilder()
			.setFile(emojis.url)
			.setName(`${emojis.name}.${emojis.animated ? 'gif' : 'png'}`);

		return interaction.reply({ files: [attachment] });
	}

};
