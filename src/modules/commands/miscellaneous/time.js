const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndent } = require('common-tags');
const moment = require('moment-timezone');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'time',
			aliases: ['clock', 'now'],
			description: 'Returns the current time in a specified timezone.',
			category: 'miscellaneous',
			usage: '<continent/city>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	async run(message, [...time]) {
		const roleColor = message.guild.me.roles.highest.hexColor;
		const link = 'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List';
		const timezone = time.join('_').toUpperCase();
		if (!timezone || !message.content.includes('/')) {
			message.channel.send(`You must provide a timezone to look up the time for. For a full list of timezones, refer to the "TZ" column here: **<${link}>**.`);
			return;
		}
		try {
			const zone = timezone.substring(timezone.indexOf('/') + 1).replace(/_/g, ' ');
			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setTitle('⌚ Time')
				.setDescription(stripIndent`
                    ***City:*** ${zone.toProperCase()}
                    ***Timezone:*** \`${moment().tz(`${timezone}`).format('[GMT] Z')}\`
                    ***Date:*** \`${moment().tz(`${timezone}`).format('dddd, MMMM D, YYYY')}\`
                    ***Current Time:*** \`${moment().tz(`${timezone}`).format('HH:mm:ss')}\``)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		} catch {
			message.channel.send(`You must provide a timezone to look up the time for. For a full list of timezones, refer to the "TZ" column [here](${link}).`);
		}
	}

};
