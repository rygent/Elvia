import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { hideLinkEmbed } from '@discordjs/formatters';
import { UserAgent } from '@/lib/utils/Constants.js';
import { Env } from '@/lib/Env.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'imgur',
			description: 'Upload a media to Imgur.',
			options: [
				{
					name: 'media',
					description: 'Media to upload.',
					type: ApplicationCommandOptionType.Attachment,
					required: true
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			defaultMemberPermissions: null,
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const media = interaction.options.getAttachment('media', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ ephemeral: !visible });

		const raw = await request(media.url, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const buffer = Buffer.from(await raw.body.arrayBuffer()).toString('base64');
		const payload = JSON.stringify({ image: buffer, type: 'base64' });

		const { body } = await request(`https://api.imgur.com/3/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Client-ID ${Env.ImgurClientId}`,
				'Content-Type': 'application/json',
				'User-Agent': UserAgent
			},
			body: payload,
			maxRedirections: 20
		});

		const response: any = await body.json();

		const replies = ['Here are your Imgur links:', `${hideLinkEmbed(response.data.link)}`].join('\n');

		return interaction.editReply({ content: replies });
	}
}
