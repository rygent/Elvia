import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	ComponentType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ContainerBuilder,
	SeparatorBuilder,
	TextDisplayBuilder
} from '@discordjs/builders';
import type { ButtonInteraction, ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, subtext } from '@discordjs/formatters';
import { sentenceCase, shuffleArray } from '@/lib/utils/functions.js';
import { nanoid } from 'nanoid';
import axios from 'axios';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
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
		const response = await axios
			.get('https://opentdb.com/api.php?amount=1&type=multiple&encode=base64')
			.then(({ data }) => data.results[0]);

		const question = Buffer.from(response.question, 'base64').toString('utf8');
		const difficulty = Buffer.from(response.difficulty, 'base64').toString('utf8');
		const category = Buffer.from(response.category, 'base64').toString('utf8');
		const answer = Buffer.from(response.correct_answer, 'base64').toString('utf8');
		const options = shuffleArray([...response.incorrect_answers, response.correct_answer]).map((item) =>
			Buffer.from(item, 'base64').toString('utf8')
		);

		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nanoid())
					.setStyle(ButtonStyle.Secondary)
					.setLabel(options[0] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nanoid())
					.setStyle(ButtonStyle.Secondary)
					.setLabel(options[1] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nanoid())
					.setStyle(ButtonStyle.Secondary)
					.setLabel(options[2] as string)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(nanoid())
					.setStyle(ButtonStyle.Secondary)
					.setLabel(options[3] as string)
			);

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						heading(question, 2),
						`${bold('Difficulty:')} ${sentenceCase(difficulty)}`,
						`${bold('Category:')} ${category}`
					].join('\n')
				)
			)
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext('You have 15 seconds to answer.')))
			.addActionRowComponents(button)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		const reply = await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({
			filter,
			componentType: ComponentType.Button,
			time: 15e3,
			max: 1
		});

		collector.on('ignore', (i: ButtonInteraction<'cached'>) => void i.deferUpdate());
		collector.on('collect', async (i: ButtonInteraction<'cached'>) => {
			const selected = i.component.label;

			const result = new TextDisplayBuilder();

			if (selected === answer) {
				result.setContent(subtext('Congratulations, your answer is correct.'));

				button.components[options.indexOf(selected)]?.setStyle(ButtonStyle.Success);
			} else {
				result.setContent(subtext(`Unfortunately, the correct answer was ${bold(answer)}.`));

				button.components[options.indexOf(selected!)]?.setStyle(ButtonStyle.Danger);
				button.components[options.indexOf(answer)]?.setStyle(ButtonStyle.Success);
			}

			container.spliceComponents(1, 1, result);

			await i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});

		collector.once('end', async (collected, reason) => {
			if (!collected.size && reason === 'time') {
				const result = new TextDisplayBuilder().setContent(subtext("Guess you didn't wanna play trivia after all?"));
				container.spliceComponents(1, 1, result);
			}

			button.components.forEach((btn) => btn.setDisabled(true));

			await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		});
	}
}
