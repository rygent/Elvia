import { CoreCommand, type CoreClient } from '@elvia/core';
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
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, subtext } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'icon',
			description: 'Display the server icon.',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Utility',
			guild_only: true
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached'>) {
		if (!interaction.guild?.iconURL()) {
			return interaction.reply({ content: 'This server has no icon.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(interaction.guild.iconURL({ size: 4096 })!)
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[`${bold('ID:')} ${inlineCode(interaction.guild.id)}`, `${bold('Name:')} ${interaction.guild.name}`].join(
						'\n'
					)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
