import { CoreClient, CoreCommand } from '@elvia/core';
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
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, subtext } from '@discordjs/formatters';
import axios from 'axios';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'pat',
			description: 'Pat someone.',
			options: [
				{
					name: 'user',
					description: 'User to interact with.',
					type: ApplicationCommandOptionType.User,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel],
			category: 'Social',
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user');

		const response = await axios.get('https://nekos.best/api/v2/pat').then(({ data }) => data.results[0]);

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(response.url)))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					`${member?.toString()}, you've got a pat from ${interaction.user.toString()}.`
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
