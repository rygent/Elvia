import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags,
	type APIMessageComponentEmoji
} from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	ContainerBuilder,
	SeparatorBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import { parseEmoji, type MessageContextMenuCommandInteraction, type StringSelectMenuInteraction } from 'discord.js';
import { bold, italic, subtext } from '@discordjs/formatters';
import { Languages } from '@/lib/utils/autocomplete.js';
import { nanoid } from 'nanoid';
import translate from '@iamtraction/google-translate';

export default class extends CoreCommand<ApplicationCommandType.Message> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.Message,
			name: 'Translate',
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel]
		});
	}

	public async execute(interaction: MessageContextMenuCommandInteraction<'cached' | 'raw'>) {
		const source = interaction.options.getMessage('message', true);

		if (!source.content) {
			return interaction.reply({ content: 'There is no text in this message.', flags: MessageFlags.Ephemeral });
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent('Please select the target language you want to translate.')
			)
			.addActionRowComponents(
				new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
					new StringSelectMenuBuilder()
						.setCustomId(nanoid())
						.setPlaceholder('Select a language')
						.setOptions(
							...Languages.filter(({ hoisted }) => hoisted).map((item) => ({
								value: item.value,
								label: item.name,
								emoji: parseEmoji(item.flag as string) as APIMessageComponentEmoji
							}))
						)
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Google Translate')}`)));

		const response = await interaction.reply({
			components: [container],
			flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message) return;

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
			time: 6e4,
			max: 1
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [selected] = i.values;

			const context = source.content.replace(/(<a?)?:\w+:(\d{17,19}>)?/g, '');

			const translated = await translate(context, { to: selected! });

			const text = new TextDisplayBuilder().setContent(
				[
					translated.text,
					`\n${subtext(`${bold(italic(resolveLanguage(translated.from.language.iso)))} \u2192 ${bold(italic(resolveLanguage(selected!)))}`)}`
				].join('\n')
			);
			container.spliceComponents(0, 1, text);
			container.spliceComponents(1, 1);

			return i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}
}

function resolveLanguage(input: string) {
	return Languages.filter(({ value }) => value.toLowerCase().includes(input.toLowerCase()))[0]!.name;
}
