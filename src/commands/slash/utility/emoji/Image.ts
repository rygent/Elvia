import type BaseClient from '../../../../lib/BaseClient.js';
import Command from '../../../../lib/structures/Interaction.js';
import { AttachmentBuilder, ChatInputCommandInteraction, parseEmoji } from 'discord.js';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'emoji image',
			description: 'Get the full size image of an emoji.',
			category: 'Utility',
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const emoji = interaction.options.getString('emoji', true);

		const fetched = await interaction.guild?.emojis.fetch();

		const emojis = fetched?.get(parseEmoji(emoji)?.id as string);
		if (!emojis?.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const attachment = new AttachmentBuilder(emojis.url).setName(`${emojis.name}.${emojis.animated ? 'gif' : 'png'}`);

		return interaction.reply({ files: [attachment] });
	}
}
