import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { AttachmentBuilder, InteractionCollector, codeBlock } from 'discord.js';
import { exec } from 'node:child_process';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['execute'],
			description: 'Executes any Shell command.',
			ownerOnly: true
		});
	}

	async run(interaction) {
		const ephemeral = interaction.options.getBoolean('ephemeral');

		const modalId = `modal-${nanoid()}`;
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Command to execute')
			.addComponents(new ActionRowBuilder()
				.addComponents(new TextInputBuilder()
					.setCustomId('command-input')
					.setStyle(TextInputStyle.Short)
					.setLabel('What’s the command to execute')
					.setRequired(true)));

		await interaction.showModal(modal);

		const filter = (i) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const command = i.fields.getTextInputValue('command-input');

			await i.deferReply({ ephemeral });

			exec(command, (error, stdout) => {
				const replies = codeBlock('shell', stdout || error).toString();
				if (replies.length <= 2000) {
					return i.editReply({ content: replies });
				} else {
					const attachment = new AttachmentBuilder()
						.setFile(Buffer.from((stdout || error).toString()))
						.setName('output.txt');

					return i.editReply({ content: 'Output was too long! The result has been sent as a file.', files: [attachment] });
				}
			});
		});
	}

}
