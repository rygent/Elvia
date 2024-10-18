// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Client, Command } from '@elvia/tesseract';
import {
	type APIMessageComponentEmoji,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	parseEmoji,
	ButtonInteraction,
	StringSelectMenuInteraction
} from 'discord.js';
import { bold, chatInputApplicationCommandMention, hyperlink, italic } from '@discordjs/formatters';
import { Colors, Emojis } from '@/lib/utils/Constants.js';
import { formatPermissions, isNsfwChannel } from '@/lib/utils/Functions.js';
import { env } from '@/env.js';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'help',
			description: 'Shows help information and commands.',
			options: [
				{
					name: 'command',
					description: 'Command to get help for.',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: false
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'General',
			enabled: false
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const command = interaction.options.getString('command');

		const app_command = await this.client.application?.commands.fetch();

		if (command) {
			const cmd = this.client.interactions.get(command);
			if (!cmd) {
				return interaction.reply({ content: 'This command does not seem to exist.', ephemeral: true });
			}

			const cmdId = app_command.find((item) => item.name === cmd.name.split(' ')[0])?.id;

			const permissions = cmd.memberPermissions.toArray();

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: this.client.user.displayAvatarURL() })
				.setTitle(`${chatInputApplicationCommandMention(cmd.name, cmdId as string)}`)
				.setThumbnail('https://i.imgur.com/YxoUvH8.png')
				.setDescription(
					[
						`${cmd.description}`,
						`${bold(italic('Category:'))} ${cmd.category}`,
						`${bold(italic('Permissions:'))} ${
							permissions?.length
								? permissions.map((item) => `\`${formatPermissions(item)}\``).join(', ')
								: 'No permission required.'
						}`,
						`${bold(italic('Cooldown:'))} ${cmd.cooldown / 1e3} second(s)`
					].join('\n')
				)
				.setFooter({
					text: `Powered by ${this.client.user.username}`,
					iconURL: interaction.user.avatarURL() as string
				});

			return interaction.reply({ embeds: [embed] });
		}

		let i0 = 0;
		let i1 = 8;
		let page = 1;

		const commands = this.client.interactions
			.filter(({ context, ownerOnly }) => !context && !ownerOnly)
			.map((item) => ({
				id: app_command.find((i) => i.name === item.name.split(' ')[0])?.id,
				...item
			}));

		const category = commands
			.filter((value, index, self) => index === self.findIndex((item) => item.category === value.category))
			.filter((item) => {
				if (item.category.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				return true;
			})
			.map((item) => ({ category: item.category }));

		let selectedCommands = commands
			.filter((cmd) => {
				if (cmd.guildOnly && !interaction.inGuild()) return false;
				return true;
			})
			.filter((cmd) => cmd.category === 'General');

		const selectId = nanoid();
		const select = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(selectId)
				.setMinValues(0)
				.setMaxValues(category.length)
				.setOptions(
					category
						.map((item) => ({
							value: item.category.toLowerCase(),
							label: item.category,
							...(item.category === 'General' && { default: true })
						}))
						.sort((a, b) => a.label.localeCompare(b.label))
				)
		);

		const firstId = nanoid();
		const previousId = nanoid();
		const pageId = nanoid();
		const nextId = nanoid();
		const lastId = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(firstId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.First) as APIMessageComponentEmoji)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(previousId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Previous) as APIMessageComponentEmoji)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(pageId)
					.setStyle(ButtonStyle.Secondary)
					.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`)
					.setDisabled(true)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nextId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Next) as APIMessageComponentEmoji)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(lastId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Last) as APIMessageComponentEmoji)
			);

		const description = [
			`Welcome to help menu, here is the list of commands!`,
			`Need more help? Come join our ${hyperlink('support server', env.SupportServerUrl)}.\n`,
			selectedCommands
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(
					(cmd) =>
						`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
				)
				.slice(i0, i1)
				.join('\n')
		];

		if (selectedCommands.length <= 8) {
			button.components[3]?.setDisabled(true);
			button.components[4]?.setDisabled(true);
		}

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: this.client.user.displayAvatarURL() })
			.setThumbnail('https://i.imgur.com/YxoUvH8.png')
			.setDescription(description.join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		const reply = await interaction.reply({ embeds: [embed], components: [select, button], fetchReply: true });

		const filter = (i: StringSelectMenuInteraction | ButtonInteraction) => i.user.id === interaction.user.id;
		const selectCollector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect
		});
		const buttonCollector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 3e5
		});

		selectCollector.on('ignore', (i) => void i.deferUpdate());
		selectCollector.on('collect', (i) => {
			buttonCollector.resetTimer();

			i0 = 0;
			i1 = 8;
			page = 1;

			const selected = i.values;
			if (!selected.length) {
				selectedCommands = commands
					.filter((cmd) => {
						if (cmd.guildOnly && !interaction.inGuild()) return false;
						return true;
					})
					.filter((cmd) => cmd.category === 'General');

				select.components[0]?.options
					.filter((options) => options.data.value === 'general')
					.forEach((options) => options.setDefault(true));
				select.components[0]?.options
					.filter((options) => options.data.value !== 'general')
					.forEach((options) => options.setDefault(false));
			}

			if (selected.length) {
				selectedCommands = commands
					.filter((cmd) => {
						if (cmd.guildOnly && !interaction.inGuild()) return false;
						return true;
					})
					.filter((cmd) => selected.includes(cmd.category.toLowerCase()));

				select.components[0]?.options
					.filter((options) => selected.includes(options.data.value as string))
					.forEach((options) => options.setDefault(true));
				select.components[0]?.options
					.filter((options) => !selected.includes(options.data.value as string))
					.forEach((options) => options.setDefault(false));
			}

			if (page === 1) {
				button.components[0]?.setDisabled(true);
				button.components[1]?.setDisabled(true);
			}

			if (selectedCommands.length <= 8) {
				button.components[3]?.setDisabled(true);
				button.components[4]?.setDisabled(true);
			}

			if (selectedCommands.length > 8) {
				button.components[3]?.setDisabled(false);
				button.components[4]?.setDisabled(false);
			}

			description.splice(
				2,
				description.length,
				selectedCommands
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(
						(cmd) =>
							`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
					)
					.slice(i0, i1)
					.join('\n')
			);

			embed.setDescription(description.join('\n'));

			button.components[2]?.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`);

			return void i.update({ embeds: [embed], components: [select, button] });
		});

		buttonCollector.on('ignore', (i) => void i.deferUpdate());
		buttonCollector.on('collect', (i) => {
			buttonCollector.resetTimer();

			switch (i.customId) {
				case firstId:
					i0 -= 8 * (page - 1);
					i1 -= 8 * (page - 1);
					page -= 1 * (page - 1);

					if (page === 1) {
						button.components[0]?.setDisabled(true);
						button.components[1]?.setDisabled(true);
					}

					if (page !== Math.ceil(selectedCommands.length / 8)) {
						button.components[3]?.setDisabled(false);
						button.components[4]?.setDisabled(false);
					}

					description.splice(
						2,
						description.length,
						selectedCommands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(
								(cmd) =>
									`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
							)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [select, button] });
				case previousId:
					i0 -= 8;
					i1 -= 8;
					page -= 1;

					if (page === 1) {
						button.components[0]?.setDisabled(true);
						button.components[1]?.setDisabled(true);
					}

					if (page !== Math.ceil(selectedCommands.length / 8)) {
						button.components[3]?.setDisabled(false);
						button.components[4]?.setDisabled(false);
					}

					description.splice(
						2,
						description.length,
						selectedCommands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(
								(cmd) =>
									`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
							)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [select, button] });
				case nextId:
					i0 += 8;
					i1 += 8;
					page += 1;

					if (page !== 1) {
						button.components[0]?.setDisabled(false);
						button.components[1]?.setDisabled(false);
					}

					if (page === Math.ceil(selectedCommands.length / 8)) {
						button.components[3]?.setDisabled(true);
						button.components[4]?.setDisabled(true);
					}

					description.splice(
						2,
						description.length,
						selectedCommands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(
								(cmd) =>
									`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
							)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [select, button] });
				case lastId:
					i0 += 8 * (Math.ceil(selectedCommands.length / 8) - page);
					i1 += 8 * (Math.ceil(selectedCommands.length / 8) - page);
					page += 1 * (Math.ceil(selectedCommands.length / 8) - page);

					if (page !== 1) {
						button.components[0]?.setDisabled(false);
						button.components[1]?.setDisabled(false);
					}

					if (page === Math.ceil(selectedCommands.length / 8)) {
						button.components[3]?.setDisabled(true);
						button.components[4]?.setDisabled(true);
					}

					description.splice(
						2,
						description.length,
						selectedCommands
							.sort((a, b) => a.name.localeCompare(b.name))
							.map(
								(cmd) =>
									`${chatInputApplicationCommandMention(cmd.name, cmd.id as string)}\n${Emojis.Branch} ${cmd.description}`
							)
							.slice(i0, i1)
							.join('\n')
					);

					embed.setDescription(description.join('\n'));

					button.components[2]?.setLabel(`${page}/${Math.ceil(selectedCommands.length / 8)}`);

					return void i.update({ embeds: [embed], components: [select, button] });
			}
		});

		buttonCollector.on('end', (collected, reason) => {
			if ((!collected.size && reason === 'time') || reason === 'time') {
				selectCollector.stop('time');
				select.components[0]?.setDisabled(true);

				button.components[0]?.setDisabled(true);
				button.components[1]?.setDisabled(true);
				button.components[3]?.setDisabled(true);
				button.components[4]?.setDisabled(true);

				return void reply.edit({ components: [select, button] });
			}
		});
	}

	public override autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused();

		const choices = this.client.interactions
			.filter(({ name }) => name.toLowerCase().includes(focused.toLowerCase()))
			.map((commands) => ({ ...commands }));

		const respond = choices
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter((cmd) => !cmd.context && !cmd.ownerOnly)
			.filter((cmd) => {
				if (cmd.category.toLowerCase() === 'nsfw' && !isNsfwChannel(interaction.channel)) return false;
				return true;
			})
			.filter((cmd) => {
				if (cmd.guildOnly && !interaction.inGuild()) return false;
				return true;
			})
			.map(({ name }) => ({ name, value: name }));

		return interaction.respond(respond.slice(0, 25));
	}
}
