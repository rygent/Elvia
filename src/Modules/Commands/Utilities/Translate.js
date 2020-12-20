const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const translator = require('../../../../assets/json/Translator.json');
const translate = require('@k3rn31p4nic/google-translate-api');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['traduction', 'translation', 'trad', 'tl'],
			description: 'Translates your text into the desired language!',
			category: 'Utilities',
			usage: '<language> <message>',
			cooldown: 8000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const prefix = guildData ? guildData.prefix : this.client.prefix;

		const embed = new MessageEmbed()
			.setColor(Colors.G_TRANSLATE)
			.setAuthor('Google Translate', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Google Translate`, message.author.avatarURL({ dynamic: true }));

		if (target === 'langs') {
			embed.setTitle('Available Languages');
			embed.setDescription(`\`\`\`JSON\n${JSON.stringify(translator).replace(/[{}]/g, '').split(',').join(',\n')}\`\`\``);

			return message.channel.send(embed).then(msg => msg.delete({ timeout: 60000 }));
		}

		if (!target) return message.quote(`Please enter a language! To display the list of languages, type \`${prefix}translate langs\` !`);

		const language = target.toLowerCase();

		const toTranslate = args.join(' ');
		if (!toTranslate) return message.quote('Please enter a text to be translated!');
		if (toTranslate.length > 2800) return message.quote('Unfortunately, the specified text is too long. Please try again with something a little shorter.');

		if (!JSON.stringify(translator).includes(language)) {
			return message.quote(`The language \`${language}\` does not exist! To display the list of languages, type \`${prefix}translate langs\` !`);
		}

		const translated = await translate(toTranslate, { to: language });

		embed.setDescription([
			`${translated.text}\n`,
			`Translation from ***${translator[translated.from.language.iso]}*** to ***${translator[language]}***`
		].join('\n'));

		message.channel.send(embed);
	}

};
