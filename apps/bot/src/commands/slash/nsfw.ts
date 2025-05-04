import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
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
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { bold, subtext } from '@discordjs/formatters';
import { isNsfwChannel } from '@/lib/utils/functions.js';
import { Nsfw } from '@/lib/utils/autocomplete.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'nsfw',
			description: 'Displays explicit content.',
			options: [
				{
					name: 'category',
					description: 'Category of content.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			nsfw: true,
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'NSFW',
			cooldown: 1e4
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const category = interaction.options.getString('category', true);
		const visible = interaction.options.getBoolean('visible') ?? false;

		try {
			const response = await axios.get(`https://nekobot.xyz/api/image?type=${category}`).then(({ data }) => data);

			const container = new ContainerBuilder()
				.addMediaGalleryComponents(
					new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(response.message).setSpoiler(visible))
				)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
				);

			return await interaction.reply({
				components: [container],
				...(visible && { flags: MessageFlags.IsComponentsV2 }),
				...(!visible && { flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] })
			});
		} catch {
			return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
		}
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();
		if (!isNsfwChannel(interaction.channel)) return interaction.respond([]);

		const choices = Nsfw.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()));

		let respond = choices.filter(({ hoisted }) => hoisted).map(({ name }) => ({ name, value: name.toLowerCase() }));

		if (focused.length) {
			respond = choices.map(({ name }) => ({ name, value: name.toLowerCase() }));

			return interaction.respond(respond.slice(0, 25));
		}

		return interaction.respond(respond.slice(0, 25));
	}
}
