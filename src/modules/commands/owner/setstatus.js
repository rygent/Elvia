const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'setstatus',
			aliases: ['setstats'],
			description: 'Sets bot\'s presence/status.',
			category: 'owner',
			usage: '<online | idle | dnd | invisible>',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	async run(message, args) {
		const status = args[0];

		if (!status) {
			message.channel.send('Please input one of the following: \\`online\\`, \\`idle\\`, \\`dnd\\` or \\`invisible\\` and try again.');
			return;
		}

		const statusType = args[0].toLowerCase();

		if (statusType === 'online' || statusType === 'idle' || statusType === 'dnd' || statusType === 'invisible') {
			this.client.user.setStatus(status);
			message.channel.send(`Status successfully changed to **${statusType}**.\nPlease note that initially changing status may take up to a minute or two.`).then(msg => msg.delete({ timeout: 10000 }));
		} else {
			message.channel.send(`"${statusType}" is not a valid status type.`);
			return;
		}
	}

};
