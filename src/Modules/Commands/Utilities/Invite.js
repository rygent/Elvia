const Command = require('../../../Structures/Command.js');
const { MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Gives you a bot invite link.',
			category: 'Utilities',
			cooldown: 3000
		});
	}

	async run(message) {
		const button = new MessageButton()
			.setStyle('LINK')
			.setLabel('Invite me!')
			.setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=2013654135&scope=bot%20applications.commands`);

		return message.reply({ content: 'Click below to invite a bot!', components: [[button]] });
	}

};
