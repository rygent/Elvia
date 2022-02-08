const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Settings/Configuration.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'translate',
			description: 'Translate your text.'
		});
	}

	async run(interaction) {
		const text = await interaction.options.getString('text', true);
		const fromLanguage = await interaction.options.getString('from');
		const toLanguage = await interaction.options.getString('to');

		let locale;
		if (interaction.guildLocale === 'zh-CN' || interaction.guildLocale === 'zh-TW') {
			locale = interaction.guildLocale;
		} else {
			locale = new Intl.Locale(interaction.guildLocale).language;
		}

		const target = toLanguage || locale;

		try {
			const translated = await translate(text, { from: fromLanguage || 'auto', to: target });
			const from = translated.from.language.iso;

			const embed = new MessageEmbed()
				.setColor(Color.DEFAULT)
				.setAuthor({ name: 'Google Translate', iconURL: 'https://i.imgur.com/1JS81kv.png', url: 'https://translate.google.com/' })
				.setDescription([
					`${translated.text}\n`,
					`Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(target)}***`
				].join('\n'))
				.setFooter({ text: 'Powered by Google Translate', iconURL: interaction.user.avatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			if (error.code === 400) {
				return interaction.reply({ content: 'Please send valid **[ISO 639-1](<https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>)** languages codes.', ephemeral: true });
			}
		}
	}

};
