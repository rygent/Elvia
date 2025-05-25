import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	SeparatorBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { pickRandom } from '@sapphire/utilities';
import { isNsfwChannel } from '@/lib/utils/functions.js';
import axios from 'axios';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'random',
			description: 'Displays random memes.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Meme'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const subredditList = ['meme', 'me_irl', 'memes', 'dankmemes', 'ComedyCemetery', 'terriblefacebookmemes', 'funny'];

		const subreddit = pickRandom(subredditList);

		const response = await axios
			.get(`https://reddit.com/r/${subreddit}/hot.json?limit=100`, {
				headers: { 'User-Agent': 'discordbot:elvia:v5.0.0 (by /u/rygentx)' }
			})
			.then(({ data }) => data);

		const filtered = response.data.children
			.filter(({ data }: any) => !data.is_self)
			.filter(({ data }: any) => data.post_hint !== 'rich:video');

		if (!isNsfwChannel(interaction.channel)) filtered.filter(({ data }: any) => !data.over_18);

		if (!filtered.length) {
			return interaction.reply({ content: 'It seems we are out of fresh memes!', flags: MessageFlags.Ephemeral });
		}

		const post = pickRandom<any>(filtered);

		const imageUrl =
			post.data?.media?.reddit_video?.fallback_url ||
			post.data?.secure_media?.reddit_video?.fallback_url ||
			post.data?.url ||
			post.data?.url_overridden_by_dest;

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(imageUrl)))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					heading(hyperlink(post.data.title, `https://reddit.com${post.data.permalink}`), 2)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Reddit')}`)));

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
