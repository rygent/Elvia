import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	ContainerBuilder,
	SeparatorBuilder,
	StringSelectMenuBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	type StringSelectMenuInteraction
} from 'discord.js';
import {
	bold,
	chatInputApplicationCommandMention,
	heading,
	hyperlink,
	inlineCode,
	quote,
	subtext
} from '@discordjs/formatters';
import { formatPermissions, isNsfwChannel } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
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

		const commandData = await this.client.application?.commands.fetch();

		const container = new ContainerBuilder()
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		if (query) {
			const command = this.client.commands.get(query);
			if (!command) {
				const text = new TextDisplayBuilder().setContent('This command does not seem to exist.');
				container.spliceComponents(0, 0, text);

				return interaction.reply({
					components: [container],
					flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
				});
			}

			const commandId = commandData.find((cmd) => cmd.name === command.unique?.split(' ')[0])!.id;
			const permissions = command.memberPermissions.toArray();

			const section = new TextDisplayBuilder().setContent(
				[
					heading(chatInputApplicationCommandMention(commandId, command.unique!), 2),
					`${command.description}`,
					...(command.options.length
						? [quote(command.options.map((option) => `${inlineCode(option.name)}: ${option.description}`).join('\n'))]
						: [])
				].join('\n')
			);
			container.spliceComponents(0, 0, section);

			const detail = new TextDisplayBuilder().setContent(
				[
					`${bold('Category:')} ${command.category}`,
					`${bold('Permissions:')} ${
						permissions?.length
							? permissions.map((item) => `\`${formatPermissions(item)}\``).join(', ')
							: 'No permission required.'
					}`,
					`${bold('Cooldown:')} ${command.cooldown / 1e3} second(s)`
				].join('\n')
			);
			container.spliceComponents(1, 0, detail);

			return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		}

		const commands = this.client.commands
			.filter(({ ownerOnly, type }) => !ownerOnly && type === ApplicationCommandType.ChatInput)
			.map((command) => ({
				id: commandData.find((cmd) => cmd.name === command.unique?.split(' ')[0])!.id,
				...command
			}));

		const category = commands
			.filter((command, index, self) => index === self.findIndex((cmd) => cmd.category === command.category))
			.filter((command) => {
				if (command.category.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				return true;
			})
			.map((command) => ({ category: command.category }));

		const section = new TextDisplayBuilder().setContent(
			[
				`Welcome to help menu, here is the list of commands!`,
				`Need more help? Come join our ${hyperlink('support server', env.SUPPORT_SERVER_URL)}.`
			].join('\n')
		);
		container.spliceComponents(0, 0, section);

		const select = new ActionRowBuilder().addStringSelectMenuComponent(
			new StringSelectMenuBuilder()
				.setCustomId(nanoid())
				.setPlaceholder('Select a category')
				.setOptions(
					category
						.map((item) => ({
							value: item.category.toLowerCase(),
							label: item.category
						}))
						.sort((a, b) => a.label.localeCompare(b.label))
				)
		);
		container.spliceComponents(1, 0, select);

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

			const selectedCategories = commands.filter((command) => command.category.toLowerCase() === selected);

			const detail = new TextDisplayBuilder().setContent(
				[
					`Welcome to help menu, here is the list of commands!`,
					`Need more help? Come join our ${hyperlink('support server', env.SUPPORT_SERVER_URL)}.`,
					selectedCategories
						.map((command) =>
							[
								`${heading(chatInputApplicationCommandMention(command.id, command.unique!), 3)}`,
								command.description
							].join('\n')
						)
						.join('\n')
				].join('\n')
			);
			container.spliceComponents(0, 1, detail);

			const selects = select.components as StringSelectMenuBuilder[];

			selects[0]?.options.forEach((option) => option.setDefault(false));
			selects[0]?.options.find((option) => option.toJSON().value === selected)?.setDefault(true);

			await i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			} else if (reason === 'time') {
				const selects = select.components as StringSelectMenuBuilder[];
				selects[0]?.setDisabled(true);

				return interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
			}
		});
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();

		const choices = this.client.commands
			.filter(({ unique }) => unique?.includes(focused.value.toLowerCase()))
			.map((commands) => ({ ...commands }));

		const respond = choices
			.sort((a, b) => a.unique!.localeCompare(b.unique!))
			.filter((command) => !command.ownerOnly && command.type === ApplicationCommandType.ChatInput)
			.filter((command) => {
				if (command.category.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				return true;
			})
			.filter((command) => {
				if (command.guildOnly && !interaction.inCachedGuild()) return false;
				return true;
			})
			.map(({ unique }) => ({ name: unique!, value: unique! }));

		return interaction.respond(respond.slice(0, 25));
	}
}
