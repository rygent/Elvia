import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ContainerBuilder, StringSelectMenuBuilder, TextDisplayBuilder } from '@discordjs/builders';
import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	type StringSelectMenuInteraction
} from 'discord.js';
import {
	blockQuote,
	bold,
	chatInputApplicationCommandMention,
	heading,
	hyperlink,
	inlineCode
} from '@discordjs/formatters';
import { formatPermissions, isNsfwChannel } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { nanoid } from 'nanoid';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'help',
			description: 'Shows help information and commands.',
			options: [
				{
					name: 'query',
					description: 'Command to get help for.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'General'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const query = interaction.options.getString('query');

		if (query) {
			let command;
			let commandName = '';

			for (const [key, value] of this.client.commands.entries()) {
				if (query !== key) continue;
				commandName = key;
				command = value;
			}

			if (!command) {
				return interaction.reply({ content: 'This command does not seem to exist.', flags: MessageFlags.Ephemeral });
			}

			if (command.data.type !== ApplicationCommandType.ChatInput) return;

			const permissions = command.member_permissions.toArray();

			const container = new ContainerBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							heading(chatInputApplicationCommandMention(commandName, command.id!), 2),
							`${command.data.description}`,
							...(command.data.options?.length
								? [
										blockQuote(
											command.data.options
												?.map((option) => `${inlineCode(option.name)}: ${option.description}`)
												.join('\n')
										)
									]
								: [])
						].join('\n')
					)
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							`${bold('Category:')} ${command.category}`,
							`${bold('Permissions:')} ${
								permissions?.length
									? permissions.map((item) => `\`${formatPermissions(item)}\``).join(', ')
									: 'No permission required.'
							}`,
							`${bold('Cooldown:')} ${command.cooldown / 1e3} second(s)`
						].join('\n')
					)
				);

			return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		}

		const commandData = [...this.client.commands.entries()]
			.filter(([, cmd]) => !cmd.owner_only && cmd.data.type === ApplicationCommandType.ChatInput)
			.map(([name, cmd]) => ({
				commandName: name,
				...cmd
			}));

		const category = commandData
			.filter((command, index, self) => {
				if (command.category?.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				return index === self.findIndex((cmd) => cmd.category === command.category);
			})
			.map((command) => ({ category: command.category! }));

		const selectId = nanoid();
		const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a category')
				.setOptions(
					category
						.sort((a, b) => a.category.localeCompare(b.category))
						.map((item) => ({
							value: item.category.toLowerCase(),
							label: item.category,
							default: item.category.toLowerCase() === 'general'
						}))
				)
		);

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`Welcome to help menu, here is the list of commands!`,
						`Need more help? Come join our ${hyperlink('support server', env.SUPPORT_SERVER_URL)}.`
					].join('\n')
				)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						commandData
							.filter((command) => command.category?.toLowerCase() === 'general')
							.map((command) =>
								[
									`${heading(chatInputApplicationCommandMention(command.commandName, command.id!), 3)}`,
									...('description' in command.data ? [command.data.description] : [])
								].join('\n')
							)
							.join('\n')
					].join('\n')
				)
			)
			.addActionRowComponents(row);

		const response = await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message) return;

		const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter,
			time: 3e5
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			const [selected] = i.values;
			collector.resetTimer();

			const categories = commandData.filter((command) => command.category?.toLowerCase() === selected);

			const list = new TextDisplayBuilder().setContent(
				[
					categories
						.map((command) =>
							[
								`${heading(chatInputApplicationCommandMention(command.commandName, command.id!), 3)}`,
								...('description' in command.data ? [command.data.description] : [])
							].join('\n')
						)
						.join('\n')
				].join('\n')
			);

			container.spliceComponents(1, 1, list);

			for (const options of row.components[0]!.options) {
				options.setDefault(options.data.value === selected);
			}

			return i.update({ components: [container] });
		});

		collector.on('end', () => {
			for (const select of row.components) {
				select.setDisabled(false);
			}

			return interaction.editReply({ components: [container] });
		});
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused(true);

		const options = [...this.client.commands.entries()]
			.filter(([name, command]) => {
				if (command.data.type !== ApplicationCommandType.ChatInput) return false;
				if (command.category?.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				if (command.guild_only && !interaction.inCachedGuild()) return false;
				if (command.owner_only) return false;
				return name.toLowerCase().includes(focused.value.toLowerCase());
			})
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([name]) => ({ name, value: name }));

		return interaction.respond(options.slice(0, 25));
	}
}
