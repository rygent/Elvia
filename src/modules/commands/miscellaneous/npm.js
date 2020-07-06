const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const npm = require('libnpmsearch');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Searches for packages on the npm registry.',
			category: 'miscellaneous',
			usage: '<query>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			message.channel.send('You must provide a search query!');
			return;
		}

		npm(query, { sortBy: 'popularity' }).then(res => {
			const embed = new MessageEmbed()
				.setColor(Colors.NPM)
				.setAuthor('NPM Search Engine', 'https://i.imgur.com/7hzjnuJ.png', 'https://www.npmjs.com/')
				.setTitle(res[0].name)
				.setURL(res[0].links ? res[0].links.npm : 'None')
				.setThumbnail(`https://i.imgur.com/CJ70ktz.png`)
				.setDescription(res[0].description ? res[0].description : 'None')
				.addField('__Details__', stripIndents`
                    ***Version:*** ${res[0].version}
                    ***Publisher:*** ${res[0].publisher.username}
                    ***Date:*** ${moment(res[0].date).format('MMMM D, YYYY')}
                    ***Repository:*** ${res[0].links.repository ? res[0].links.repository : 'None'}
                    ***Keywords:*** ${res[0].keywords ? res[0].keywords.join(', ') : 'None'}`)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by NPM`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}).catch(() => message.channel.send('No results were found!'));
	}

};
