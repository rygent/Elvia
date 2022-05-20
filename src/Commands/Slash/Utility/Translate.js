const InteractionCommand = require('../../../Structures/Interaction');
const { EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../../Utils/Constants');
const translate = require('@iamtraction/google-translate');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['translate'],
			description: 'Translate your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);
		const fromLanguage = await interaction.options.getString('from');
		const toLanguage = await interaction.options.getString('to');

		let locale;
		if (!interaction.inGuild()) locale = !['zh-CN', 'zh-TW'].includes(interaction.locale) ? new Intl.Locale(interaction.locale).language : interaction.locale;
		else locale = !['zh-CN', 'zh-TW'].includes(interaction.guildLocale) ? new Intl.Locale(interaction.guildLocale).language : interaction.guildLocale;

		const target = toLanguage || locale;

		try {
			const translated = await translate(text, { from: fromLanguage || 'auto', to: target });
			const from = translated.from.language.iso;

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Google Translate', iconURL: 'https://i.imgur.com/1JS81kv.png', url: 'https://translate.google.com/' })
				.setDescription(translated.text)
				.addFields([{ name: '\u200B', value: `Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(target)}***`, inline: false }])
				.setFooter({ text: 'Powered by Google Translate', iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			if (error.code === 400) {
				return interaction.reply({ content: 'Please send valid **[ISO 639-1](<https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>)** languages codes.', ephemeral: true });
			}
		}
	}

};
