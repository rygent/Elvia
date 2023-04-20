import type BaseClient from '../../../lib/BaseClient.js';
import Command from '../../../lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';
import { Advances, Credentials } from '../../../lib/utils/Constants.js';
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

		const raw = await request(media.url, {
			method: 'GET',
			headers: { 'User-Agent': Advances.UserAgent },
			maxRedirections: 20
		});

		const buffer = Buffer.from(await raw.body.arrayBuffer()).toString('base64');
		const payload = JSON.stringify({ image: buffer, type: 'base64' });

		const { body } = await request(`https://api.imgur.com/3/upload`, {
			method: 'POST',
			headers: {
				'Authorization': `Client-ID ${Credentials.ImgurClientId}`,
				'Content-Type': 'application/json',
				'User-Agent': Advances.UserAgent
			},
			body: payload,
			maxRedirections: 20
		});

		const response = await body.json();

		const replies = [
			'Here are your Imgur links:',
			`${hideLinkEmbed(response.data.link)}`
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
