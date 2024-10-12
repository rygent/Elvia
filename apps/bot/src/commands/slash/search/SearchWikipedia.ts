import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'wikipedia',
			description: 'Search for something on Wikipedia.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			defaultMemberPermissions: null,
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const raw = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		if (raw.statusCode === 404) {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}

		const response: any = await raw.body.json();

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.content_urls.desktop.page)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Wikipedia', iconURL: 'https://i.imgur.com/a4eeEhh.png', url: 'https://en.wikipedia.org/' })
			.setTitle(response.title)
			.setThumbnail(response.originalimage?.source)
			.setDescription(response.extract)
			.setFooter({ text: `Powered by Wikipedia`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
