import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, hideLinkEmbed, subtext } from '@discordjs/formatters';
import { env } from '@/env.js';
import axios from 'axios';

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
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const media = interaction.options.getAttachment('media', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ ...(!visible && { flags: MessageFlags.Ephemeral }) });

		const response = await axios
			.post(
				`https://api.imgur.com/3/upload`,
				{ image: media.url, type: 'url' },
				{
					headers: {
						Authorization: `Client-ID ${env.IMGUR_CLIENT_ID}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			)
			.then(({ data }) => data);

		const replies = [
			'Here are your Imgur links:',
			`${hideLinkEmbed(response.data.link)}`,
			subtext(`Powered by ${bold('Imgur')}`)
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
