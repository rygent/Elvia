import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { isNsfwChannel } from '@/lib/utils/Functions.js';
import nsfw from '@/assets/json/nsfw.json' with { type: 'json' };
import { request } from 'undici';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'nsfw',
			description: 'Displays explicit content.',
			category: 'NSFW',
			cooldown: 1e4,
			nsfw: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const category = interaction.options.getString('category', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		try {
			const raw = await request(`https://nekobot.xyz/api/image?type=${category}`, {
				method: 'GET',
				headers: { 'User-Agent': UserAgent },
				maxRedirections: 20
			});

			const response: any = await raw.body.json();

			const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Open in Browser').setURL(response.message)
			);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setImage(response.message)
				.setFooter({
					text: `Powered by ${this.client.user.username}`,
					iconURL: interaction.user.avatarURL() as string
				});

			return await interaction.reply({ embeds: [embed], components: [button], ephemeral: !visible });
		} catch {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();
		if (!isNsfwChannel(interaction.channel)) return interaction.respond([]);

		const choices = nsfw.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));

		let respond = choices.filter(({ hoisted }) => hoisted).map(({ name }) => ({ name, value: name.toLowerCase() }));

		if (focused.length) {
			respond = choices.map(({ name }) => ({ name, value: name.toLowerCase() }));

			return interaction.respond(respond.slice(0, 25));
		}

		return interaction.respond(respond.slice(0, 25));
	}
}
