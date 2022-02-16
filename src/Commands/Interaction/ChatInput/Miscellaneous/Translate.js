const Interaction = require('../../../../Structures/Interaction');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../../Utils/Constants');
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

		const locale = !['zh-CN', 'zh-TW'].includes(interaction.guildLocale) ? new Intl.Locale(interaction.guildLocale).language : interaction.guildLocale;
		const target = toLanguage || locale;

		try {
			const translated = await translate(text, { from: fromLanguage || 'auto', to: target });
			const from = translated.from.language.iso;

			const embed = new MessageEmbed()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Google Translate', iconURL: 'https://i.imgur.com/1JS81kv.png', url: 'https://translate.google.com/' })
				.setDescription([
					`${translated.text}\n`,
					`Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(target)}***`
				].join('\n'))
				.setFooter({ text: 'Powered by Google Translate', iconURL: interaction.user.avatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed] });
		} catch (e) {
			if (e.code === 400) {
				return interaction.reply({ content: 'Please send valid **[ISO 639-1](<https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>)** languages codes.', ephemeral: true });
			}
		}
	}

};
