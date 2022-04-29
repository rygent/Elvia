const { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders');
const { InteractionType, TextInputStyle } = require('discord-api-types/v10');
const { InteractionCollector, WebhookClient } = require('discord.js');
const { Colors, Links } = require('../Constants');
const { nanoid } = require('nanoid');

module.exports = class ReportModal {

	constructor(client, options = {}) {
		this.client = client;
		this.collector = options.collector;
	}

	async showModal(interaction) {
		const modalId = `modal-${nanoid()}`;
		const modal = new ModalBuilder()
			.setCustomId(modalId)
			.setTitle('Report bug')
			.addComponents([new ActionRowBuilder()
				.addComponents([new TextInputBuilder()
					.setCustomId('issue-form')
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setLabel('Issue Description')
					.setPlaceholder('Describe the issue in as much detail as possible.')])]);

		await interaction.showModal(modal);

		const filter = (i) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, time: 900000, max: 1 });

		collector.on('collect', async (i) => {
			const issue = await i.fields.getTextInputValue('issue-form');

			if (Links.ReportWebhook) {
				const webhook = new WebhookClient({ url: Links.ReportWebhook });

				const embed = new EmbedBuilder()
					.setColor(Colors.Red)
					.setAuthor({ name: i.user.tag, iconURL: i.user.avatarURL() })
					.setTitle('Bug Report')
					.setDescription(issue)
					.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

				await webhook.send({ embeds: [embed], username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ size: 4096 }) });
			}

			collector.stop('collected');
			return i.reply({ content: 'Thank you, your report has been informed to our developers.', ephemeral: true });
		});

		collector.on('end', (collected, reason) => {
			if (reason === 'collected') return this.collector.stop('collected');
		});
	}

};
