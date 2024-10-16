import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors } from '@/lib/utils/Constants.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
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
		const subreddit = [
			'meme',
			'me_irl',
			'memes',
			'dankmeme',
			'dankmemes',
			'ComedyCemetery',
			'terriblefacebookmemes',
			'funny'
		];

		const random_subreddit = Math.floor(Math.random() * subreddit.length);

		const response = await axios
			.get(`https://www.reddit.com/r/${subreddit[random_subreddit]}/random/.json`)
			.then(({ data }) => data[0]);

		const post = response.data.children
			.filter(({ data }: any) => !data.over_18)
			.filter(({ data }: any) => !data.is_video);

		if (!post.length) return interaction.reply({ content: 'It seems we are out of fresh memes!', ephemeral: true });

		const random_post = Math.floor(Math.random() * post.length);

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`https://reddit.com${post[random_post].data.permalink}`)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setTitle(post[random_post].data.title)
			.setImage(post[random_post].data.url || post[random_post].data.url_overridden_by_dest)
			.setFooter({ text: 'Powered by Reddit', iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
