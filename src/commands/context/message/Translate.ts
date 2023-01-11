import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { ContextMenuCommandInteraction } from 'discord.js';
import translate from '@iamtraction/google-translate';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'Translate',
			context: true
		});
	}

	public async execute(interaction: ContextMenuCommandInteraction<'cached' | 'raw'>) {
		const message = interaction.options.getMessage('message', true);
		await interaction.deferReply({ ephemeral: true });

		if (!message.content) return interaction.editReply({ content: 'There is no text in this message.' });

		let target = interaction.locale as string;
		if (!['zh-CN', 'zh-TW'].includes(interaction.locale)) {
			target = new Intl.Locale(interaction.locale).language;
		}

		const translated = await translate(message.content.replace(/(<a?)?:\w+:(\d{17,19}>)?/g, ''), { to: target });

		return interaction.editReply({ content: translated.text });
	}
}
