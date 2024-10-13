import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { disableAllButtons, sentenceCase, shuffleArray } from '@/lib/utils/Functions.js';
import { request } from 'undici';
import { nanoid } from 'nanoid';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'trivia',
			description: 'Plays a quick trivia game.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const raw = await request('https://opentdb.com/api.php?amount=1&type=multiple&encode=base64', {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json().then(({ results }: any) => results[0]);
		response.incorrect_answers.push(response.correct_answer);

		const trivia = {
			question: Buffer.from(response.question, 'base64').toString('utf8'),
			difficulty: Buffer.from(response.difficulty, 'base64').toString('utf8'),
			category: Buffer.from(response.category, 'base64').toString('utf8'),
			answer: Buffer.from(response.correct_answer, 'base64').toString('utf8'),
			options: shuffleArray(response.incorrect_answers).map((item) => Buffer.from(item, 'base64').toString('utf8'))
		};

		const question = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(
				[
					`### ${trivia.question}`,
					`${italic('You have 15 seconds to answer.')}\n`,
					`${bold(italic('Difficulty:'))} ${sentenceCase(trivia.difficulty)}`,
					`${bold(italic('Category:'))} ${trivia.category}`
				].join('\n')
			);

		const answer = new EmbedBuilder().setColor(Colors.Default);

		const first = nanoid();
		const second = nanoid();
		const third = nanoid();
		const fourth = nanoid();
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(first)
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.options[0] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(second)
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.options[1] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(third)
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.options[2] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(fourth)
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.options[3] as string)
			);

		const reply = await interaction.reply({ embeds: [question], components: [button] });

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 15e3,
			max: 1
		});

		collector.on('ignore', (i: ButtonInteraction<'cached'>) => void i.deferUpdate());
		collector.on('collect', (i: ButtonInteraction<'cached'>) => {
			if (trivia.answer !== i.component.label) {
				answer.setDescription(`Unfortunately, the correct answer was ${bold(trivia.answer)}.`);
				button.components[trivia.options.indexOf(i.component.label!)]?.setStyle(ButtonStyle.Danger);
				button.components[trivia.options.indexOf(trivia.answer)]?.setStyle(ButtonStyle.Success);
				disableAllButtons(button);

				return void i.update({ embeds: [question, answer], components: [button] });
			}

			answer.setDescription('Congratulations, your answer is correct.');
			button.components[trivia.options.indexOf(i.component.label)]?.setStyle(ButtonStyle.Success);
			disableAllButtons(button);

			return void i.update({ embeds: [question, answer], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				answer.setDescription("Guess you didn't wanna play trivia after all?");
				disableAllButtons(button);

				return void interaction.editReply({ embeds: [question, answer], components: [button] });
			}
		});
	}
}
