import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import { InteractionType, TextInputStyle } from 'discord-api-types/v10';
import { InteractionCollector, WebhookClient, parseWebhookURL } from 'discord.js';
import { nanoid } from 'nanoid';
import { Colors, Links } from '../Constants.js';

export default class ReportModal {

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
					.setLabel('Title')
					.setPlaceholder('Bug: <title>')
					.setRequired(true)
					.setMaxLength(100)))
			.addComponents(new ActionRowBuilder()
				.addComponents(new TextInputBuilder()
					.setCustomId('describe')
					.setStyle(TextInputStyle.Paragraph)
					.setLabel('Description')
					.setPlaceholder('Describe the issue in as much detail as possible.')
					.setRequired(true)
					.setMaxLength(4000)));

		await interaction.showModal(modal);

		const filter = (i) => i.customId === modalId;
		const collector = new InteractionCollector(this.client, { filter, interactionType: InteractionType.ModalSubmit, max: 1 });

		collector.on('collect', async (i) => {
			const [title, describe] = ['title', 'describe'].map(id => i.fields.getTextInputValue(id));

			await this.webhook(i, { title, describe });
			return i.reply({ content: 'Thank you, your report has been informed to our developers.', ephemeral: true });
		});

		collector.on('end', () => this.collector.stop('collected'));
	}

	async webhook(interaction, { title, describe }) {
		if (!Links.ReportWebhook) return;
		const webhook = new WebhookClient(parseWebhookURL(Links.ReportWebhook));

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.setTitle(title)
			.setDescription(describe)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username });
	}

}
