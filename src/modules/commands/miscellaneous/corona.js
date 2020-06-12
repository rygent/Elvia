const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const api = require('novelcovid');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'corona',
			aliases: ['covid', 'cv', 'covid19', 'coronavirus'],
			description: 'Shows the current coronavirus cases.',
			category: 'miscellaneous',
			usage: '[Country Code/Name]',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		const country = args.join(' ').toLowerCase();
		let roleColor;
		if (!message.guild) {
			roleColor = Colors.DEFAULT;
		} else {
			roleColor = message.guild.me.roles.highest.hexColor;
		}

		let stats;
		if (country) {
			stats = await api.countries({ country: `${country}` });
		} else {
			stats = await api.all();
		}

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor('Global cases for COVID19', '', 'https://www.worldometers.info/coronavirus')
			.setDescription('Sometimes the number of cases may be slightly different.')
			.addField('Confirmed', `**${stats.cases.formatNumber()}** (+${stats.todayCases.formatNumber()})`, false)
			.addField('Death', `**${stats.deaths.formatNumber()}** (+${stats.todayDeaths.formatNumber()})`, false)
			.addField('Recovered', `**${stats.recovered.formatNumber()}** [${Math.round((stats.recovered / stats.cases) * 1000) / 10}%]`, true)
			.addField('Infected', `**${stats.active.formatNumber()}** [${Math.round((stats.active / stats.cases) * 1000) / 10}%]`, true)
			.addField('Critical', `**${stats.critical.formatNumber()}** [${Math.round((stats.critical / stats.cases) * 1000) / 10}%]`, true)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Updated on`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp(new Date(stats.updated));

		if (country) {
			embed.setAuthor(`COVID19 cases for ${stats.country}`, '', 'https://www.worldometers.info/coronavirus');
			embed.setThumbnail(stats.countryInfo ? stats.countryInfo.flag : null);
		}

		message.channel.send(embed);
	}

};
