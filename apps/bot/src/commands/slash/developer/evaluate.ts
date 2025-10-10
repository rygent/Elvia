import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags,
	TextInputStyle
} from 'discord-api-types/v10';
import { LabelBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { AttachmentBuilder, type ChatInputCommandInteraction, type ModalSubmitInteraction } from 'discord.js';
import { codeBlock, inlineCode } from '@discordjs/formatters';
import { Emojis } from '@/lib/utils/constants.js';
import { Type } from '@sapphire/type';
import { nanoid } from 'nanoid';
import { inspect } from 'node:util';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'evaluate',
			description: 'Evaluates any JavaScript code.',
			options: [
				{
					name: 'depth',
					description: 'The inspection depth to apply.',
					type: ApplicationCommandOptionType.Integer,
					required: false
				},
				{
					name: 'async',
					description: 'Whether this code should be evaluated asynchronously.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			default_member_permissions: '0',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Developer',
			owner_only: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const depth = interaction.options.getInteger('depth');
		const async = interaction.options.getBoolean('async') ?? false;
		const visible = interaction.options.getBoolean('visible') ?? false;

		const modalId = nanoid();
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Evaluate JavaScript')
			.addLabelComponents(
				new LabelBuilder()
					.setLabel('Code')
					.setDescription('Enter the JavaScript code to evaluate.')
					.setTextInputComponent(
						new TextInputBuilder()
							.setCustomId(`code:${modalId}`)
							.setStyle(TextInputStyle.Paragraph)
							.setPlaceholder('e.g. console.log("Hello, world!");')
							.setMaxLength(4000)
							.setRequired()
					)
			);

		await interaction.showModal(modal);

		const filter = (i: ModalSubmitInteraction) => i.customId === modalId;
		const submitted = await interaction.awaitModalSubmit({ filter, time: 9e5 }).catch(() => null);
		if (!submitted) return;

		let code = submitted.fields.getTextInputValue(`code:${modalId}`).replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;

		await submitted.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });

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
				`${codeBlock('js', clean(inspect(evaled, { depth }), this.client.token))}\n`,
				`${Emojis.Info} ${inlineCode(new Type(evaled).is)} `,
				`${Emojis.Alarm} ${inlineCode(`${(stop[0] * 1e9 + stop[1]) / 1e6}ms`)}`
			].join('');

			if (replies.length > 2e3) {
				const attachment = new AttachmentBuilder(
					Buffer.from(clean(inspect(evaled, { depth }), this.client.token))
				).setName('output.txt');

				return await submitted.editReply({
					content: 'Output was too long! The result has been sent as a file.',
					files: [attachment]
				});
			}

			return await submitted.editReply({ content: replies });
		} catch (error) {
			const replies = [`${codeBlock('xl', error as string)}`, `${Emojis.Info} ${inlineCode(new Type(error).is)}`].join(
				'\n'
			);

			return submitted.editReply({ content: replies });
		}
	}
}

function clean<Type extends string>(content: Type, token: string): Type {
	const cleaned = content
		.replace(/`/g, `\`${String.fromCharCode(8203)}`)
		.replace(/@/g, `@${String.fromCharCode(8203)}`)
		.replace(
			new RegExp(token, 'gi'),
			token
				.split('.')
				.map((str, i) => (i > 1 ? str.replace(/./g, '*') : str))
				.join('.')
		);

	return cleaned as Type;
}
