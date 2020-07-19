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
			memberPerms: [],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 8000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const embed = new MessageEmbed()
			.setColor(Colors.G_TRANSLATE)
			.setAuthor('Google Translate', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
			.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Google Translate`, message.author.avatarURL({ dynamic: true }));

		if (target === 'langs') {
			embed.setTitle('Available Languages');
			embed.setDescription(`\`\`\`JSON\n${JSON.stringify(langs).replace(/[{}]/g, '').split(',').join(',\n')}\`\`\``);

			return message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
		}

		if (!target) return this.client.embeds.common('commonError', message, `Please enter a language! To display the list of languages, type \`${this.client.prefix}translate langs\` !`);

		const language = target.toLowerCase();

		const toTranslate = args.join(' ');
		if (!toTranslate) return this.client.embeds.common('commonError', message, 'Please enter a text to be translated!');
		if (toTranslate.length > 2800) return this.client.embeds.common('commonError', message, 'Unfortunately, the specified text is too long. Please try again with something a little shorter.');

		if (!JSON.stringify(langs).includes(language)) {
			return this.client.embeds.common('commonError', message, `The language \`${language}\` does not exist! To display the list of languages, type \`${this.client.prefix}translate langs\` !`);
		}

		const translated = await translate(toTranslate, { to: language });

		embed.setDescription(stripIndents`
			${translated.text}
			\nTranslation from ***${langs[translated.from.language.iso]}*** to ***${langs[language]}***
		`);

		message.channel.send(embed);
	}

};
