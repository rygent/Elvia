const Command = require('../../Structures/Command.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const npm = require('libnpmsearch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Shows package information from the NPM registry.',
			category: 'Miscellaneous',
			usage: '[searchQuery]',
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.reply({ content: 'Please enter a query to search!' });
		}

		try {
			const result = await npm(query, { sortBy: 'popularity' });

			const embed = new MessageEmbed()
				.setColor(Color.NPM)
				.setAuthor('NPM', 'https://i.imgur.com/7hzjnuJ.png', 'https://www.npmjs.com/')
				.setTitle(result[0].name)
				.setURL(result[0].links ? result[0].links.npm : 'None')
				.setThumbnail(`https://i.imgur.com/CJ70ktz.png`)
				.setDescription(result[0].description ? result[0].description : 'None')
				.addField('__Details__', [
					`***Version:*** ${result[0].version}`,
					`***Publisher:*** ${result[0].publisher.username}`,
					`***Date:*** ${Formatters.time(new Date(result[0].date))}`,
					`***Repository:*** ${result[0].links.repository ? result[0].links.repository : 'None'}`,
					`***Keywords:*** ${result[0].keywords ? result[0].keywords.join(', ') : 'None'}`
				].join('\n'))
				.setFooter(`${message.author.username}  •  Powered by NPM`, message.author.avatarURL({ dynamic: true }));

			return message.reply({ embeds: [embed] });
		} catch {
			return message.reply({ content: 'No results found!' });
		}
	}

};
