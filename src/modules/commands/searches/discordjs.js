const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['djs', 'docs'],
			description: 'Searches the DJS docs for whatever you\'d like',
			category: 'searches',
			usage: '<query> (branch)',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [query]) {
		if (!query) return message.channel.send('Please input a provided query');

		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`, { headers }).then(res => {
			const result = res.data;
			if (!result || result.error) return message.channel.send(`I don't know mate, but "${query}" doesn't make any sense!`);

			const embed = new MessageEmbed(result)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Discord.js`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}).catch(() => message.channel.send('Darn it! I failed!'));
	}

};
