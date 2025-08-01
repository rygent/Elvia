import { CoreCommand, type CoreClient } from '@elvia/core';
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
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, subtext } from '@discordjs/formatters';
import axios from 'axios';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'banner',
			description: 'Display the banner of the provided user.',
			options: [
				{
					name: 'user',
					description: 'User to display.',
					type: ApplicationCommandOptionType.User,
					required: false
				},
				{
					name: 'color',
					description: "Display user's banner color.",
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const user = await this.client.users.fetch(interaction.options.getUser('user') ?? interaction.user, {
			force: true
		});
		const color = interaction.options.getBoolean('color') ?? false;

		const container = new ContainerBuilder();

		if (color) {
			if (!user.hexAccentColor) {
				return interaction.reply({
					content: `${bold(user.tag)}'s has no banner color!`,
					flags: MessageFlags.Ephemeral
				});
			}

			const response = await axios
				.get(`http://www.thecolorapi.com/id?hex=${user.hexAccentColor.replace(/#/g, '')}`)
				.then(({ data }) => data);

			container.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(
						`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`
					)
				)
			);
			container.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('ID:')} ${inlineCode(user.id)}`,
						`${bold('Username:')} ${user.tag}`,
						`${bold('Hex:')} ${response.hex.value}`
					].join('\n')
				)
			);
			container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
			container.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

			return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		}

		if (!user.banner) {
			return interaction.reply({ content: `${bold(user.tag)}'s has no banner!`, flags: MessageFlags.Ephemeral });
		}

		container.addMediaGalleryComponents(
			new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(user.bannerURL({ size: 4096 }) as string))
		);
		container.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(
				[`${bold('ID:')} ${inlineCode(user.id)}`, `${bold('Username:')} ${user.tag}`].join('\n')
			)
		);
		container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
		container.addTextDisplayComponents(
			new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
		);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
