import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { ChatInputCommandInteraction, resolveColor } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { UserAgent } from '#lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'search color',
			description: 'Get information about a color.',
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		let color = interaction.options.getString('color', true);

		if (color.match(/^#?[0-9a-f]{3,6}$/g)) {
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
				ephemeral: true
			});
		}

		const raw = await request(`http://www.thecolorapi.com/id?hex=${color.replace('#', '')}`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response: any = await raw.body.json();

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`http://www.thecolorapi.com/id?format=html&hex=${response.hex.clean}`)
		);

		const embed = new EmbedBuilder()
			.setColor(resolveColor(response.hex.clean))
			.setTitle(response.name.value)
			.setDescription(
				[
					`${bold(italic('Hex:'))} ${response.hex.value}`,
					`${bold(italic('RGB:'))} (${response.rgb.r}, ${response.rgb.g}, ${response.rgb.b})`,
					`${bold(italic('HSL:'))} (${response.hsl.h}, ${response.hsl.s}%, ${response.hsl.l}%)`,
					`${bold(italic('HSV:'))} (${response.hsv.h}, ${response.hsv.s}%, ${response.hsv.v}%)`,
					`${bold(italic('CMYK:'))} (${response.cmyk.c}, ${response.cmyk.m}, ${response.cmyk.y}, ${response.cmyk.k})`,
					`${bold(italic('XYZ:'))} (${response.XYZ.X}, ${response.XYZ.Y}, ${response.XYZ.Z})`
				].join('\n')
			)
			.setImage(`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}

function rgbToHex(rgb: string): string {
	const [r, g, b] = rgb.match(/\d+/g)!.map((num) => Number(num));
	return ((1 << 24) + ((r as number) << 16) + ((g as number) << 8) + (b as number)).toString(16).slice(1);
}
