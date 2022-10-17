import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { AttachmentBuilder, InteractionCollector, codeBlock, inlineCode } from 'discord.js';
import { Type } from '@sapphire/type';
import { Emojis } from '../../../Utils/Constants.js';
import { inspect } from 'node:util';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['evaluate'],
			description: 'Evaluates any JavaScript code.',
			ownerOnly: true
		});
	}

	async run(interaction) {
		const depth = interaction.options.getInteger('depth');
		const async = interaction.options.getBoolean('async');
		const ephemeral = interaction.options.getBoolean('ephemeral');

		const modalId = `modal-${nanoid()}`;
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Code to evaluate')
			.addComponents(new ActionRowBuilder()
				.addComponents(new TextInputBuilder()
					.setCustomId('code-input')
					.setStyle(TextInputStyle.Paragraph)
					.setLabel('What’s the code to evaluate')
					.setRequired(true)));

		await interaction.showModal(modal);

		const filter = (i) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			let code = i.fields.getTextInputValue('code-input')
				.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
			let evaled;

			await i.deferReply({ ephemeral });

			if (async) {
				const indentedCode = code.split('\n').map((codeLine) => `  ${codeLine}`).join('\n');
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
					`${Emojis.Alarm} ${inlineCode(`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`)}`
				].join('');

				if (replies.length <= 2000) {
					return i.editReply({ content: replies });
				} else {
					const attachment = new AttachmentBuilder()
						.setFile(Buffer.from(this.clean(inspect(evaled, { depth }))))
						.setName('output.txt');

					return i.editReply({ content: 'Output was too long! The result has been sent as a file.', files: [attachment] });
				}
			} catch (error) {
				const replies = [
					`${codeBlock('xl', error)}`,
					`${Emojis.Info} ${inlineCode(new Type(error).is)}`
				].join('\n');

				return i.editReply({ content: replies });
			}
		});
	}

	clean(content) {
		if (typeof content !== 'string') return content;
		const cleaned = content
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(new RegExp(this.client.token, 'gi'), 'No Token');
		return cleaned;
	}

}
