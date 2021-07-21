const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tr', 'translation'],
			description: 'Translate your text to the desired language.',
			category: 'Utilities',
			usage: '[languageCodes] [text]',
			cooldown: 5000
		});
	}

	async run(message, [target, ...args]) {
		if (!target) return message.reply({ content: `Please provide the desired language!` });

		const toTranslate = args.join(' ');
		if (!toTranslate) return message.reply({ content: 'Please provide the text you want to translate!' });

		if (toTranslate.length > 2800) return message.reply({ content: 'Unfortunately, the text is too long!\nPlease try again with shorter text.' });

		try {
			const translated = await translate(toTranslate, { to: target.toLowerCase() });
			const from = translated.from.language.iso;

			const embed = new MessageEmbed()
				.setColor(Color.G_TRANSLATE)
				.setAuthor('Google Translate', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
				.setDescription([
					`${translated.text}\n`,
					`Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(target)}***`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Google Translate`, message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ embeds: [{
				color: Color.DEFAULT,
				description: 'Please send valid [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) languages codes.'
			}] });
		}
	}

};
