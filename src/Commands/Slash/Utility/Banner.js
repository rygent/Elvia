import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { resolveColor } from 'discord.js';
import { fetch } from 'undici';
import Command from '../../../Structures/Interaction.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['banner'],
			description: 'Display the banner of the provided user.'
		});
	}

	async run(interaction) {
		const user = await this.client.users.fetch(interaction.options.getUser('user') || interaction.user, { force: true });
		const color = interaction.options.getBoolean('color');

		const embed = new EmbedBuilder()
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		if (color) {
			if (!user.hexAccentColor) return interaction.reply({ content: `**${user.tag}**'s has no banner color!`, ephemeral: true });

			const raw = await fetch(`http://www.thecolorapi.com/id?hex=${user.hexAccentColor.replace(/#/g, '')}`, { method: 'GET' });
			const response = await raw.json();

			embed.setColor(resolveColor(response.hex.clean));
			embed.setDescription([
				`***ID:*** \`${user.id}\``,
				`***Hex:*** ${response.hex.value}`
			].join('\n'));
			embed.setImage(`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`);

			return interaction.reply({ embeds: [embed] });
		}

		if (!user.banner) return interaction.reply({ content: `**${user.tag}**'s has no banner!`, ephemeral: true });

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.bannerURL({ extension: 'png', size: 4096 })));

		embed.setColor(Colors.Default);
		embed.setDescription(`***ID:*** \`${user.id}\``);
		embed.setImage(user.bannerURL({ size: 512 }));

		return interaction.reply({ embeds: [embed], components: [button] });
	}

}
