import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, ContainerBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { type AutocompleteInteraction, type ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, subtext } from '@discordjs/formatters';
import { sentenceCase, shuffleArray } from '@/lib/utils/functions.js';
import { fetcher } from '@/lib/fetcher.js';
import { nanoid } from 'nanoid';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'trivia',
			description: 'Plays a quick trivia game.',
			options: [
				{
					name: 'category',
					description: 'Pick a category.',
					type: ApplicationCommandOptionType.Number,
					autocomplete: true,
					required: false
				},
				{
					name: 'difficulty',
					description: 'Choose how challenging the questions should be.',
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: 'Easy',
							value: 'easy'
						},
						{
							name: 'Medium',
							value: 'medium'
						},
						{
							name: 'Hard',
							value: 'hard'
						}
					],
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const category = interaction.options.getNumber('category');
		const difficulty = interaction.options.getString('difficulty');

		const params = new URLSearchParams();
		params.append('amount', '1');
		params.append('encode', 'base64');
		params.append('type', 'multiple');

		if (category) params.append('category', category.toString());
		if (difficulty) params.append('difficulty', difficulty);

		const respond = await fetcher(`https://opentdb.com/api.php?${params.toString()}`, {
			method: 'GET'
		}).then((data) => data.results[0]);

		const decode = (data: string) => Buffer.from(data, 'base64').toString('utf8');

		const question = decode(respond.question);
		const correct = decode(respond.correct_answer);
		const incorrect = respond.incorrect_answers.map(decode);
		const allAnswers = shuffleArray([...incorrect, correct]);

		const buttonId = nanoid();
		const row = new ActionRowBuilder<ButtonBuilder>();
		for (const [index, answer] of allAnswers.entries()) {
			const customId = `answer_${index + 1}:${buttonId}`;
			row.addComponents(new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Secondary).setLabel(answer));
		}

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						heading(question, 2),
						`${bold('Difficulty:')} ${sentenceCase(decode(respond.difficulty))}`,
						`${bold('Category:')} ${decode(respond.category)}`
					].join('\n')
				)
			)
			.addActionRowComponents(row)
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext('You have 15 seconds to answer.')));

		const response = await interaction.reply({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message) return;

		try {
			const filter = async (i: ButtonInteraction) => {
				if (i.user.id !== interaction.user.id) {
					await i.deferUpdate();
					return false;
				}
				return true;
			};

			const clicked = await message.awaitMessageComponent({
				componentType: ComponentType.Button,
				filter,
				time: 15e3
			});

			if (clicked.component.style === ButtonStyle.Premium) return;
			const selected = clicked.component.label;

			if (selected === correct) {
				const result = new TextDisplayBuilder().setContent(subtext('Well done! You got it!'));
				container.spliceComponents(2, 1, result);

				for (const [index, button] of row.components.entries()) {
					if (allAnswers[index] === selected) button.setStyle(ButtonStyle.Success);
					button.setDisabled(true);
				}
			} else {
				const result = new TextDisplayBuilder().setContent(subtext('Close, but not correct.'));
				container.spliceComponents(2, 1, result);

				for (const [index, button] of row.components.entries()) {
					if (allAnswers[index] === selected!) button.setStyle(ButtonStyle.Danger);
					if (allAnswers[index] === correct) button.setStyle(ButtonStyle.Success);
					button.setDisabled(true);
				}
			}

			return await clicked.update({ components: [container] });
		} catch (error) {
			if (error instanceof Error && error.name === 'Error [InteractionCollectorError]') {
				const result = new TextDisplayBuilder().setContent(subtext("Time's up! You ran out of time."));
				container.spliceComponents(2, 1, result);

				for (const button of row.components) button.setDisabled(true);

				return interaction.editReply({ components: [container] });
			}

			throw error;
		}
	}

	public override async autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>) {
		const focused = interaction.options.getFocused(true);

		const respond = await fetcher('https://opentdb.com/api_category.php', {
			method: 'GET'
		}).then((data) => data.trivia_categories);

		if (!respond.length) return interaction.respond([]);

		const options = respond
			.filter((data: any) => data.name.toLowerCase().includes(focused.value.toLowerCase()))
			.map((data: any) => ({
				name: data.name,
				value: data.id
			}));

		return interaction.respond(options.slice(0, 25));
	}
}
