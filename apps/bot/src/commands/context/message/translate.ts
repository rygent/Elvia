import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags,
	type APIMessageComponentEmoji
} from 'discord-api-types/v10';
import { ActionRowBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { parseEmoji, type MessageContextMenuCommandInteraction, type StringSelectMenuInteraction } from 'discord.js';
import { Languages } from '@/lib/utils/autocomplete.js';
import translate from '@iamtraction/google-translate';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.Message,
			name: 'Translate',
			description: '',
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel]
		});
	}

	public async execute(interaction: MessageContextMenuCommandInteraction<'cached' | 'raw'>) {
		const message = interaction.options.getMessage('message', true);
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		if (!message.content) return interaction.editReply({ content: 'There is no text in this message.' });

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a languages')
				.setOptions(
					...Languages.filter(({ hoisted }) => hoisted).map((item) => ({
						value: item.value,
						label: item.name,
						emoji: parseEmoji(item.flag as string) as APIMessageComponentEmoji
					}))
				)
		);

		const reply = await interaction.editReply({ components: [select] });

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [selected] = i.values;

			const translated = await translate(message.content.replace(/(<a?)?:\w+:(\d{17,19}>)?/g, ''), {
				to: selected as string
			});

			return void interaction.editReply({ content: translated.text, components: [] });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}
