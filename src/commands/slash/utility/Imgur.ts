import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';
import { Credentials } from '../../../lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'imgur',
			description: 'Upload a media to Imgur.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const media = interaction.options.getAttachment('media', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ ephemeral: !visible });

		const { body } = await request(media.url, { method: 'GET' });
		const buffer = Buffer.from(await body.arrayBuffer()).toString('base64');

		const raw = await request(`https://api.imgur.com/3/upload`, {
			body: JSON.stringify({ image: buffer, type: 'base64' }),
			headers: { 'Authorization': `Client-ID ${Credentials.ImgurClientId}`, 'Content-Type': 'application/json' },
			method: 'POST'
		});

		const response = await raw.body.json();

		const replies = [
			'Here are your Imgur links:',
			`${hideLinkEmbed(response.data.link)}`
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
