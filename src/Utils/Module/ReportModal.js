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
			.addComponents(new ActionRowBuilder()
				.addComponents(new TextInputBuilder()
					.setCustomId('title')
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
					.setLabel('Title')
					.setPlaceholder('Bug: <title>')
					.setMaxLength(100)))
			.addComponents(new ActionRowBuilder()
				.addComponents(new TextInputBuilder()
					.setCustomId('describe')
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setLabel('Description')
					.setPlaceholder('Describe the issue in as much detail as possible.')
					.setMaxLength(2048)));

		await interaction.showModal(modal);

		const filter = (i) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const [title, describe] = ['title', 'describe'].map(id => i.fields.getTextInputValue(id));

			await this.sendWebhook(i, { title, describe });
			return i.reply({ content: 'Thank you, your report has been informed to our developers.', ephemeral: true });
		});

		collector.on('end', () => this.collector.stop('collected'));
	}

	async sendWebhook(interaction, { title, describe }) {
		if (!Links.ReportWebhook) return;
		const webhook = new WebhookClient({ url: Links.ReportWebhook });

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.setTitle(title)
			.setDescription(describe)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ size: 4096 }) });
	}

};
