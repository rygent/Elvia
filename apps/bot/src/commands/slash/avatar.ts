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
import { bold, inlineCode, subtext } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'avatar',
			description: 'Display the avatar of the provided user.',
			options: [
				{
					name: 'user',
					description: 'User to display.',
					type: ApplicationCommandOptionType.User,
					required: false
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const user = interaction.options.getUser('user') ?? interaction.user;

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(user.displayAvatarURL({ size: 4096 })))
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[`${bold('ID:')} ${inlineCode(user.id)}`, `${bold('Username:')} ${user.tag}`].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
