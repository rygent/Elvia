import { CoreContext, type CoreClient } from '@elvia/core';
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
import { type UserContextMenuCommandInteraction } from 'discord.js';
import { bold, inlineCode, subtext } from '@discordjs/formatters';

export default class extends CoreContext {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.User,
			name: 'Avatar',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild]
		});
	}

	public execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user')!;

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(member.displayAvatarURL({ size: 4096 }))
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[`${bold('ID:')} ${inlineCode(member.user.id)}`, `${bold('Username:')} ${member.user.tag}`].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] });
	}
}
