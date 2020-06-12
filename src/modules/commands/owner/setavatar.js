const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'setavatar',
			aliases: ['setav'],
			description: 'Sets the avatar of the Bots Account',
			category: 'owner',
			usage: '<URL>',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	async run(message, args) {
		if (!args || args.length < 1) {
			message.channel.send('Please provide me with a valid link to set my avatar.');
			return;
		}

		this.client.user.setAvatar(args.join(' '));

		message.channel.send('Profile photo has been changed!').then(msg => msg.delete({ timeout: 5000 }));
	}

};
