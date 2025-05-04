import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { bold, hideLinkEmbed, hyperlink, italic, subtext } from '@discordjs/formatters';
import { Languages } from '@/lib/utils/autocomplete.js';
import translate from '@iamtraction/google-translate';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'translate',
			description: 'Translate your text.',
			options: [
				{
					name: 'text',
					description: 'Text to translate.',
					type: ApplicationCommandOptionType.String,
					max_length: 2000,
					required: true
				},
				{
					name: 'from',
					description: 'Source language. (Defaults to auto)',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false
				},
				{
					name: 'to',
					description: 'Destination language. (Defaults to server language)',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);
		const from = interaction.options.getString('from');
		const to = interaction.options.getString('to');

		const target = to ?? resolveDefaultLanguage(interaction);

		try {
			const translated = await translate(text, { from: from ?? 'auto', to: target });

			const container = new ContainerBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							translated.text,
							`\n${subtext(`${bold(italic(resolveLanguage(translated.from.language.iso)))} \u2192 ${bold(italic(resolveLanguage(target)))}`)}`
						].join('\n')
					)
				)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('Google Translate')}`))
				);

			return await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		} catch (error: any) {
			if (error.code === 400) {
				const replies = `Please send valid ${hyperlink(
					'ISO 639-1',
					hideLinkEmbed('https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes')
				)} languages codes.`;

				return interaction.reply({ content: replies, flags: MessageFlags.Ephemeral });
			}
		}
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused(true);

		const choices = Languages.filter(({ name }) => name.toLowerCase().includes(focused.value.toLowerCase()));

		let respond = choices.filter(({ hoisted }) => hoisted).map(({ name, value }) => ({ name, value }));

		if (focused.value.length) {
			respond = choices.map(({ name, value }) => ({ name, value }));

			return interaction.respond(respond.slice(0, 25));
		}

		return interaction.respond(respond.slice(0, 25));
	}
}

function resolveDefaultLanguage(interaction: ChatInputCommandInteraction): string {
	if (interaction.inGuild()) {
		if (!['zh-CN', 'zh-TW'].includes(interaction.guildLocale)) {
			return new Intl.Locale(interaction.guildLocale).language;
		}

		return interaction.guildLocale;
	}

	if (!['zh-CN', 'zh-TW'].includes(interaction.locale)) {
		return new Intl.Locale(interaction.locale).language;
	}

	return interaction.locale;
}

function resolveLanguage(input: string) {
	return Languages.filter(({ value }) => value.toLowerCase().includes(input.toLowerCase()))[0]!.name;
}
