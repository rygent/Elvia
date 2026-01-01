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
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { fetcher } from '@/lib/fetcher.js';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'color',
			description: 'Get information about a color.',
			options: [
				{
					name: 'color',
					description: 'Hexadecimal/RGB code of the color or random to get a random color.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		let color = interaction.options.getString('color', true);

		if (color.match(/^#?[0-9a-fA-F]{3,6}$/g)) {
			color = color.toLowerCase();
		} else if (
			color.match(
				/^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])(\W+)([01]?\d\d?|2[0-4]\d|25[0-5])\W+(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/g
			)
		) {
			color = rgbToHex(color);
		} else if (/random/i.exec(color)) {
			color = Math.floor(Math.random() * (0xffffff + 1)).toString(16);
		} else {
			return interaction.reply({
				content: `Please provide a valid ${bold('hexadecimal')}/${bold('rgb')} color code. Example: ${bold(
					'#77dd77'
				)}/${bold('(253, 253, 150)')} or ${bold('random')} to get a random color.`,
				flags: MessageFlags.Ephemeral
			});
		}

		const respond = await fetcher(`http://www.thecolorapi.com/id?hex=${color.replace('#', '')}`, {
			method: 'GET'
		});

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(
						`https://serux.pro/rendercolour?hex=${respond.hex.clean}&height=200&width=512`
					)
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					heading(
						hyperlink(respond.name.value, `http://www.thecolorapi.com/id?format=html&hex=${respond.hex.clean}`),
						2
					)
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('Hex:')} ${respond.hex.value}`,
						`${bold('RGB:')} (${respond.rgb.r}, ${respond.rgb.g}, ${respond.rgb.b})`,
						`${bold('HSL:')} (${respond.hsl.h}, ${respond.hsl.s}%, ${respond.hsl.l}%)`,
						`${bold('HSV:')} (${respond.hsv.h}, ${respond.hsv.s}%, ${respond.hsv.v}%)`,
						`${bold('CMYK:')} (${respond.cmyk.c}, ${respond.cmyk.m}, ${respond.cmyk.y}, ${respond.cmyk.k})`,
						`${bold('XYZ:')} (${respond.XYZ.X}, ${respond.XYZ.Y}, ${respond.XYZ.Z})`
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}

function rgbToHex(rgb: string): string {
	const [r, g, b] = rgb.match(/\d+/g)!.map((num) => Number(num));
	return ((1 << 24) + ((r as number) << 16) + ((g as number) << 8) + (b as number)).toString(16).slice(1);
}
