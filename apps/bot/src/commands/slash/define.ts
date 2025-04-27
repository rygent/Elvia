import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { italic, underline } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/constants.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'define',
			description: 'Define a word.',
			options: [
				{
					name: 'word',
					description: 'Word to define.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const word = interaction.options.getString('word', true);

		const response = await axios
			.get(`https://api.urbandictionary.com/v0/define?page=1&term=${encodeURIComponent(word)}`)
			.then(({ data }) => data.list.sort((a: any, b: any) => b.thumbs_up - a.thumbs_up)[0]);

		if (!response) {
			return interaction.reply({ content: 'No definition found for this word.', flags: MessageFlags.Ephemeral });
		}

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Open in Browser').setURL(response.permalink)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({
				name: 'Urban Dictionary',
				iconURL: 'https://i.imgur.com/qjkcwXu.png',
				url: 'https://urbandictionary.com/'
			})
			.setTitle(response.word)
			.setDescription(response.definition)
			.addFields({ name: underline(italic('Example')), value: response.example, inline: false })
			.setFooter({ text: `Powered by Urban Dictionary`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
