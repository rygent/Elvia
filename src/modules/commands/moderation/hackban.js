const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['forceban', 'banid'],
			description: 'Bans a user, even if they aren\'t in your server.',
			category: 'moderation',
			usage: '<user-id> <reason>',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		if (isNaN(parseInt(target)) || target.length !== 18) return message.channel.send('Please input a valid user ID!');
		if (target === message.author.id) return message.channel.send('You can\'t hackban yourself!');
		if (target === this.client.user.id) return message.channel.send('Please don\'t hackban me...!');
		// eslint-disable-next-line no-process-env
		if (target === process.env.OWNER) return message.channel.send('I can\'t hackban my master');

		if (message.guild.members.cache.get(target)) {
			return message.channel.send('That user is in the server, hackban is meant to ban people who isn\'t in the server to prevent them from (re)joining in the future.');
		}

		const reason = args.join(' ');
		if (!reason) return message.channel.send('Please provide a reason for the punishment.');

		message.guild.members.ban(target, { reason: `${message.author.tag}: ${reason}` });
		message.channel.send(`Successfully banned the user with the ID \`${target}\`.`);
	}

};
