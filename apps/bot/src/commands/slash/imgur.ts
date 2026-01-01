import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, hideLinkEmbed, subtext } from '@discordjs/formatters';
import { FormData, fetcher } from '@/lib/fetcher.js';
import { env } from '@/env.js';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
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
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const media = interaction.options.getAttachment('media', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		await interaction.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });

		const form = new FormData();
		form.append('type', 'url');
		form.append('image', media.url);

		const respond = await fetcher(`https://api.imgur.com/3/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Client-ID ${env.IMGUR_CLIENT_ID}`
			},
			body: form
		});

		const replies = [
			'Here are your Imgur links:',
			`${hideLinkEmbed(respond.data.link)}`,
			subtext(`Powered by ${bold('Imgur')}`)
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
