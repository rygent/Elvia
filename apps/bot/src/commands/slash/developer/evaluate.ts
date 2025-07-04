import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	InteractionType,
	MessageFlags,
	TextInputStyle
} from 'discord-api-types/v10';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	InteractionCollector,
	ModalSubmitInteraction
} from 'discord.js';
import { codeBlock, inlineCode } from '@discordjs/formatters';
import { Emojis } from '@/lib/utils/constants.js';
import { Type } from '@sapphire/type';
import { nanoid } from 'nanoid';
import { inspect } from 'node:util';

export default class extends Command {
	public constructor(client: Client<true>) {
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
			defaultMemberPermissions: '0',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Developer',
			owner: true
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

			await i.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });

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
