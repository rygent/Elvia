import type { BaseClient } from '#lib/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	InteractionCollector,
	ModalSubmitInteraction
} from 'discord.js';
import { codeBlock, inlineCode } from '@discordjs/formatters';
import { Emojis } from '#lib/utils/Constants.js';
import { Type } from '@anishshobith/deeptype';
import { inspect } from 'node:util';
import { nanoid } from 'nanoid';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'evaluate',
			description: 'Evaluates any JavaScript code.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const depth = interaction.options.getInteger('depth');
		const async = interaction.options.getBoolean('async') ?? false;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Code to evaluate')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('code-input')
						.setStyle(TextInputStyle.Paragraph)
						.setLabel("What's the code to evaluate")
						.setRequired(true)
				)
			);

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, {
			filter,
			interactionType: InteractionType.ModalSubmit,
			max: 1
		});

		collector.on('collect', async (i: ModalSubmitInteraction) => {
			let code = i.fields.getTextInputValue('code-input').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
			let evaled;

			await i.deferReply({ ephemeral: !visible });

			if (async) {
				const indentedCode = code
					.split('\n')
					.map((codeLine: string) => `  ${codeLine}`)
					.join('\n');
				code = `(async () => {\n${indentedCode}\n})();`;
			}

			try {
				const start = process.hrtime();
				evaled = eval(code);
				if (evaled instanceof Promise) {
					evaled = await evaled;
				}
				const stop = process.hrtime(start);
				const replies = [
					`${codeBlock('js', this.clean(inspect(evaled, { depth })))}\n`,
					`${Emojis.Info} ${inlineCode(new Type(evaled).is)} `,
					`${Emojis.Alarm} ${inlineCode(`${(stop[0] * 1e9 + stop[1]) / 1e6}ms`)}`
				].join('');

				if (replies.length <= 2e3) {
					return void i.editReply({ content: replies });
				}
				const attachment = new AttachmentBuilder(Buffer.from(this.clean(inspect(evaled, { depth })))).setName(
					'output.txt'
				);

				return void i.editReply({
					content: 'Output was too long! The result has been sent as a file.',
					files: [attachment]
				});
			} catch (error) {
				const replies = [
					`${codeBlock('xl', error as string)}`,
					`${Emojis.Info} ${inlineCode(new Type(error).is)}`
				].join('\n');

				return void i.editReply({ content: replies });
			}
		});
	}

	private clean(content: any) {
		if (typeof content !== 'string') return content;
		const cleaned = content
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(
				new RegExp(this.client.token, 'gi'),
				this.client.token
					.split('.')
					.map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
					.join('.')
			);
		return cleaned;
	}
}
