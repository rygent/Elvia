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
import { HeadingLevel, heading, inlineCode, subtext, userMention } from '@discordjs/formatters';
import { ButtonInteraction, type ChatInputCommandInteraction } from 'discord.js';
import { nanoid } from 'nanoid';
import { delay } from '@/lib/utils/functions.js';
import { pickRandom } from '@sapphire/utilities';

export default class extends CoreCommand<ApplicationCommandType.ChatInput> {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'rps',
			description: 'Play rock paper scissors with your friends.',
			options: [
				{
					name: 'user',
					description: 'User to play with.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'best-of',
					description: 'Best of to play.',
					type: ApplicationCommandOptionType.Integer,
					choices: [
						{ name: 'Best of 1', value: 1 },
						{ name: 'Best of 3', value: 3 },
						{ name: 'Best of 5', value: 5 },
						{ name: 'Best of 7', value: 7 }
					],
					required: false
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const challenger = interaction.user;
		const opponent = interaction.options.getUser('user', true);
		const rounds = interaction.options.getInteger('best-of') ?? 1;

		if (opponent.id === challenger.id) {
			return interaction.reply({ content: 'You can’t duel yourself.', flags: MessageFlags.Ephemeral });
		}

		if (opponent.bot && opponent.id !== this.client.application.id) {
			return interaction.reply({ content: 'You can’t duel bots.', flags: MessageFlags.Ephemeral });
		}

		const choices = [
			{ emoji: '👊', label: 'Rock', value: 'rock' },
			{ emoji: '✋', label: 'Paper', value: 'paper' },
			{ emoji: '✌️', label: 'Scissor', value: 'scissor' }
		];

		const buttonId = nanoid();
		const buttons = new ActionRowBuilder<ButtonBuilder>();
		for (const choice of choices) {
			buttons.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(`${choice.value}:${buttonId}`)
					.setLabel(choice.label)
					.setEmoji({ name: choice.emoji })
			);
		}

		let currentRound = 1;
		const scores = new Map<string, number>([
			[challenger.id, 0],
			[opponent.id, 0]
		]);

		const container = new ContainerBuilder()
			.addTextDisplayComponents((text) => text.setContent(subtext(`Best of ${rounds}`)))
			.addTextDisplayComponents((text) =>
				text.setContent(
					heading(
						`${userMention(challenger.id)} ${inlineCode(scores.get(challenger.id)!.toString())} vs ${inlineCode(scores.get(opponent.id)!.toString())} ${userMention(opponent.id)}`,
						HeadingLevel.Three
					)
				)
			);

		const response = await interaction.reply({
			components: [container, buttons],
			flags: MessageFlags.IsComponentsV2,
			withResponse: true
		});

		const message = response.resource?.message;
		if (!message) return;

		const selection = new Map<string, string>();
		const history = new Map<number, string>();

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id || i.user.id === opponent.id;
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter,
			time: 6e4
		});

		collector.on('ignore', (i) => void i.deferUpdate());
		collector.on('collect', async (i) => {
			await i.deferUpdate();
			const player = i.user;

			if (selection.has(player.id)) {
				return interaction.followUp({
					content: 'You already made your choice! Please wait for your opponent.',
					flags: MessageFlags.Ephemeral
				});
			}

			const [selected] = i.customId.split(':');
			selection.set(player.id, selected!);

			if (opponent.id === this.client.application.id && !selection.has(opponent.id)) {
				const pick = pickRandom(choices);
				selection.set(opponent.id, pick.value);
			}

			if (selection.size < 2) return;

			for (const button of buttons.components) {
				button.setDisabled(true);
			}

			const player1 = selection.get(challenger.id);
			const player2 = selection.get(opponent.id);
			const result = getWinner(player1!, player2!);

			const player1Chosen = choices.find(({ value }) => value === player1);
			const player2Chosen = choices.find(({ value }) => value === player2);

			if (result === 1) {
				scores.set(challenger.id, scores.get(challenger.id)! + 1);
				history.set(
					currentRound,
					`${player1Chosen?.emoji} vs ${player2Chosen?.emoji} ${userMention(challenger.id)} won!`
				);
			} else if (result === 2) {
				scores.set(opponent.id, scores.get(opponent.id)! + 1);
				history.set(
					currentRound,
					`${player1Chosen?.emoji} vs ${player2Chosen?.emoji} ${userMention(opponent.id)} won!`
				);
			} else {
				history.set(currentRound, `${player1Chosen?.emoji} vs ${player2Chosen?.emoji} Draw!`);
			}

			const resultScore = new TextDisplayBuilder().setContent(
				heading(
					`${userMention(challenger.id)} ${inlineCode(scores.get(challenger.id)!.toString())} vs ${inlineCode(scores.get(opponent.id)!.toString())} ${userMention(opponent.id)}`,
					HeadingLevel.Three
				)
			);
			container.spliceComponents(1, 1, resultScore);

			const resultText = new TextDisplayBuilder().setContent(
				[...history.entries().map(([key, value]) => `${key}. ${value}`)].join('\n')
			);
			container.spliceComponents(2, 1, resultText);

			const winGoal = Math.ceil(rounds / 2);
			if (scores.get(challenger.id) === winGoal || scores.get(opponent.id) === winGoal) {
				await i.editReply({ components: [container, buttons] });
				return collector.stop('finished');
			}

			await i.editReply({ components: [container, buttons] });
			await delay(1500);

			currentRound++;
			selection.clear();
			collector.resetTimer();

			for (const button of buttons.components) {
				button.setDisabled(false);
			}

			return i.editReply({ components: [container, buttons] });
		});

		collector.on('end', (_, reason) => {
			if (reason === 'time') {
				for (const button of buttons.components) {
					button.setDisabled(true);
				}

				const resultText = new TextDisplayBuilder().setContent(subtext('Time’s up! The game has been canceled.'));
				container.spliceComponents(2, 0, resultText);

				return interaction.editReply({ components: [container, buttons] });
			}
		});
	}
}

function getWinner(player1: string, player2: string) {
	if (player1 === player2) return 0;
	const rules = {
		rock: 'scissor',
		scissor: 'paper',
		paper: 'rock'
	};
	return Reflect.get(rules, player1) === player2 ? 1 : 2;
}
