const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'translate',
			description: 'Translate text.'
		});
	}

	async run(interaction) {
		const fromLanguage = await interaction.options.getString('from', true);
		const toLanguage = await interaction.options.getString('to', true);
		const text = await interaction.options.getString('text', true);

		try {
			const translated = await translate(text, { from: fromLanguage.trim(), to: toLanguage.trim() });
			const from = translated.from.language.iso;

			const embed = new MessageEmbed()
				.setColor(Color.G_TRANSLATE)
				.setAuthor({ name: 'Google Translate', iconURL: 'https://i.imgur.com/1JS81kv.png', url: 'https://translate.google.com/' })
				.setDescription([
					`${translated.text}\n`,
					`Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(toLanguage.trim())}***`
				].join('\n'))
				.setFooter({ text: 'Powered by Google Translate', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			return await interaction.reply({ embeds: [embed] });
		} catch {
			return await interaction.reply({ content: 'Please send valid **[ISO 639-1](<https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>)** languages codes.', ephemeral: true });
		}
	}

};
