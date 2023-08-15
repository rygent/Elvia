import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '#lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'meme random',
			description: 'Displays random memes.',
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

		const raw = await request(`https://www.reddit.com/r/${subreddit[random_subreddit]}/random/.json`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response: any = await raw.body.json();

		const post = response[0].data.children
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
