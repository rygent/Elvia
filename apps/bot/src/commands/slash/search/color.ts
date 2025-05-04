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
import { ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
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

		const response = await axios
			.get(`http://www.thecolorapi.com/id?hex=${color.replace('#', '')}`)
			.then(({ data }) => data);

		const container = new ContainerBuilder()
			.addMediaGalleryComponents(
				new MediaGalleryBuilder().addItems(
					new MediaGalleryItemBuilder().setURL(
						`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`
					)
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						heading(
							hyperlink(response.name.value, `http://www.thecolorapi.com/id?format=html&hex=${response.hex.clean}`),
							2
						),
						`${bold('Hex:')} ${response.hex.value}`,
						`${bold('RGB:')} (${response.rgb.r}, ${response.rgb.g}, ${response.rgb.b})`,
						`${bold('HSL:')} (${response.hsl.h}, ${response.hsl.s}%, ${response.hsl.l}%)`,
						`${bold('HSV:')} (${response.hsv.h}, ${response.hsv.s}%, ${response.hsv.v}%)`,
						`${bold('CMYK:')} (${response.cmyk.c}, ${response.cmyk.m}, ${response.cmyk.y}, ${response.cmyk.k})`,
						`${bold('XYZ:')} (${response.XYZ.X}, ${response.XYZ.Y}, ${response.XYZ.Z})`
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
