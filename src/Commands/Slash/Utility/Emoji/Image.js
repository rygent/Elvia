import { AttachmentBuilder, parseEmoji } from 'discord.js';
import Command from '../../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'image'],
			description: 'Get the full size image of an emoji.'
		});
	}

	async run(interaction) {
		const emoji = interaction.options.getString('emoji', true);

		const parse = parseEmoji(emoji);
		const emojis = await interaction.guild.emojis.cache.get(parse.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const attachment = new AttachmentBuilder()
			.setFile(emojis.url)
			.setName(`${emojis.name}.${emojis.animated ? 'gif' : 'png'}`);

		return interaction.reply({ files: [attachment] });
	}

}
