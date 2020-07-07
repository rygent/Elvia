const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const langs = require('../../../../assets/json/translate.json');
const translate = require('@vitalets/google-translate-api');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['traduction', 'translation', 'trad', 'tl'],
			description: 'Translates your text into the desired language!',
			category: 'utility',
			usage: '<language> <message>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const embed = new MessageEmbed()
			.setColor(Colors.G_TRANSLATE)
			.setAuthor('Google Translate Engine', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
			.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Google Translate`, message.author.avatarURL({ dynamic: true }));

		if (target === 'langs') {
			embed.setTitle('Available Languages');
			embed.setDescription(`\`\`\`JSON\n${JSON.stringify(langs).replace(/[{}]/g, '').split(',').join(',\n')}\`\`\``);

			return message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
		}

		const language = target.toLowerCase();
		if (!language) return message.channel.send(`Please enter a language! To display the list of languages, type \`${this.client.prefix}translate langs\` !`);

		const toTranslate = args.join(' ');
		if (!toTranslate) return message.channel.send('Please enter a text to be translated!');
		if (toTranslate.length > 2800) return message.channel.send('Unfortunately, the specified text is too long. Please try again with something a little shorter.');

		if (!JSON.stringify(langs).includes(language)) {
			return message.channel.send(`The language \`${language}\` does not exist! To display the list of languages, type \`${this.client.prefix}translate langs\` !`);
		}

		const translated = await translate(toTranslate, { to: language });

		embed.setTitle('Translator');
		embed.setDescription(stripIndents`
			From ***${langs[translated.from.language.iso]}:***
			${toTranslate}\n
			To ***${langs[language]}:***
			${translated.text}
		`);

		message.channel.send(embed);
	}

};
