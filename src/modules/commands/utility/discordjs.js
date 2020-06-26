const Command = require('../../../structures/Command.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['djs', 'docs'],
			description: 'Searches the DJS docs for whatever you\'d like',
			category: 'utility',
			usage: '<query> (branch)',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		const query = args.join(' ');

		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`, { headers }).then(res => {
			const embed = res.data;

			if (embed && !embed.error) {
				message.channel.send({ embed });
			} else {
				message.channel.send(`I don't know mate, but "${query}" doesn't make any sense!`);
			}
		}).catch(() => message.channel.send('Darn it! I failed!'));
	}

};
