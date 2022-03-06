const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'color',
			description: 'Get information about a color.'
		});
	}

	async run(interaction) {
		const color = await interaction.options.getString('color', true);

		const hexregex = RegExp(/^#?[0-9a-f]{3,6}$/g);
		const rgbregex = RegExp(/^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])(\W+)([01]?\d\d?|2[0-4]\d|25[0-5])\W+(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/g);

		let link;
		if (color.match(hexregex)) {
			link = `http://www.thecolorapi.com/id?hex=${color.replace(/#/g, '')}`;
		} else if (color.match(rgbregex)) {
			link = `http://www.thecolorapi.com/id?rgb=${color}`;
		} else if (color === 'random') {
			const random = Math.floor(Math.random() * 16777215).toString(16);
			link = `http://www.thecolorapi.com/id?hex=${random}`;
		} else {
			return interaction.reply({ content: 'Please provide a valid **hexadecimal**/**rgb** color code. Example: **#77dd77**/**(253, 253, 150)** or **random** to get a random color.', ephemeral: true });
		}

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(link, { headers }).then(res => res.data);

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`http://www.thecolorapi.com/id?format=html&hex=${result.hex.clean}`));

		const embed = new MessageEmbed()
			.setColor(result.hex.clean)
			.setTitle(result.name.value)
			.setDescription([
				`***Hex:*** ${result.hex.value}`,
				`***RGB:*** (${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`,
				`***HSL:*** (${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`,
				`***HSV:*** (${result.hsv.h}, ${result.hsv.s}%, ${result.hsv.v}%)`,
				`***CMYK:*** (${result.cmyk.c}, ${result.cmyk.m}, ${result.cmyk.y}, ${result.cmyk.k})`,
				`***XYZ:*** (${result.XYZ.X}, ${result.XYZ.Y}, ${result.XYZ.Z})`
			].join('\n'))
			.setImage(`https://serux.pro/rendercolour?hex=${result.hex.clean}&height=200&width=512`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
