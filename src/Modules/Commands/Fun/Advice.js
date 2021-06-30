const Command = require('../../../Structures/Command.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Gives you advice.',
			category: 'Fun',
			cooldown: 3000
		});
	}

	async run(message) {
		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const data = await axios.get('https://api.adviceslip.com/advice', { headers }).then(res => res.data);

		return message.reply(data.slip.advice);
	}

};
