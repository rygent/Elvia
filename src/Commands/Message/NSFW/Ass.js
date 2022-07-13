import Command from '../../../Structures/Command.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors } from '../../../Utils/Constants.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ass',
			description: 'This command contain explicit content!',
			category: 'NSFW',
			cooldown: 10_000,
			disabled: true,
			nsfw: true
		});
	}

	async run(message) {
		const raw = await fetch('https://nekobot.xyz/api/image?type=ass');
		const response = await raw.json();

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(response.message));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setImage(response.message)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		return message.reply({ embeds: [embed], components: [button] });
	}

}
