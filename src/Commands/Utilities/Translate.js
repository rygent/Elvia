const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Structures/Configuration.js');
const translator = require('../../../assets/json/Translator.json');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['tr', 'translation'],
			description: 'Translate your text to the desired language.',
			category: 'Utilities',
			usage: '[language] [text]',
			cooldown: 8000
		});
	}

	async run(message, [target, ...args]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const prefix = guildData ? guildData.prefix : this.client.prefix;

		const embed = new MessageEmbed()
			.setColor(Color.G_TRANSLATE)
			.setAuthor('Google Translate', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Google Translate`, message.author.avatarURL({ dynamic: true }));

		if (target === 'lang') {
			embed.setTitle('Available Languages');
			embed.setDescription(`\`\`\`JSON\n${JSON.stringify(translator).replace(/[{}]/g, '').split(',').join(',\n')}\`\`\``);

			return message.reply({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 60000));
		}

		if (!target) return message.reply({ content: `Please provide the desired language!\nTo display a list of languages, type \`${prefix}translate lang\` !` });

		const language = target.toLowerCase();

		const toTranslate = args.join(' ');
		if (!toTranslate) return message.reply({ content: 'Please provide the text you want to translate!' });
		if (toTranslate.length > 2800) return message.reply({ content: 'Unfortunately, the text is too long!\nPlease try again with shorter text.' });

		if (!JSON.stringify(translator).includes(language)) {
			return message.reply({ content: `The language of \`${language}\` does not exist!\nTo display a list of languages, type \`${prefix}translate lang\` !` });
		}

		const translated = await translate(toTranslate, { to: language });

		embed.setDescription([
			`${translated.text}\n`,
			`Translation from ***${translator[translated.from.language.iso]}*** to ***${translator[language]}***`
		].join('\n'));

		return message.reply({ embeds: [embed] });
	}

};
