import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { resolveColor } from 'discord.js';
import { rgbToHex } from '../../../Utils/Function.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['color'],
			description: 'Get information about a color.'
		});
	}

	async run(interaction) {
		let color = await interaction.options.getString('color', true);

		if (color.match(/^#?[0-9a-f]{3,6}$/g)) {
			color = color.toLowerCase();
		} else if (color.match(/^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])(\W+)([01]?\d\d?|2[0-4]\d|25[0-5])\W+(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/g)) {
			color = rgbToHex(color);
		} else if (color.match(/random/i)) {
			color = Math.floor(Math.random() * (0xffffff + 1)).toString(16);
		} else {
			return interaction.reply({ content: 'Please provide a valid **hexadecimal**/**rgb** color code. Example: **#77dd77**/**(253, 253, 150)** or **random** to get a random color.', ephemeral: true });
		}

		const raw = await fetch(`http://www.thecolorapi.com/id?hex=${color.replace('#', '')}`, { method: 'GET' });
		const response = await raw.json();

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`http://www.thecolorapi.com/id?format=html&hex=${response.hex.clean}`));

		const embed = new EmbedBuilder()
			.setColor(resolveColor(response.hex.clean))
			.setTitle(response.name.value)
			.setDescription([
				`***Hex:*** ${response.hex.value}`,
				`***RGB:*** (${response.rgb.r}, ${response.rgb.g}, ${response.rgb.b})`,
				`***HSL:*** (${response.hsl.h}, ${response.hsl.s}%, ${response.hsl.l}%)`,
				`***HSV:*** (${response.hsv.h}, ${response.hsv.s}%, ${response.hsv.v}%)`,
				`***CMYK:*** (${response.cmyk.c}, ${response.cmyk.m}, ${response.cmyk.y}, ${response.cmyk.k})`,
				`***XYZ:*** (${response.XYZ.X}, ${response.XYZ.Y}, ${response.XYZ.Z})`
			].join('\n'))
			.setImage(`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
