import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { fetch } from 'undici';
import Command from '../../../Structures/Command.js';
import { Colors } from '../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'boobs',
			description: 'This command contain explicit content!',
			category: 'NSFW',
			cooldown: 10_000,
			disabled: true,
			nsfw: true
		});
	}

	async run(message) {
		const raw = await fetch('http://api.oboobs.ru/boobs/0/1/random');
		const response = await raw.json();

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`http://media.oboobs.ru/${response[0].preview}`));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setImage(`http://media.oboobs.ru/${response[0].preview}`)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		return message.reply({ embeds: [embed], components: [button] });
	}

}
