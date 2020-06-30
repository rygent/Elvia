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
		if (target === this.client.user.id) return message.channel.send('Please don\'t banned me...!');
		if (target === message.author.id) return message.channel.send('You can\'t banned yourself!');
		// eslint-disable-next-line no-process-env
		if (target === process.env.OWNER) return message.channel.send('I can\'t banned my master');

		if (message.guild.members.cache.get(target)) {
			return message.channel.send('That user is in the server, hackban is meant to ban people who isn\'t in the server to prevent them from (re)joining in the future.');
		}

		let reason = args.join(' ');
		if (!reason) {
			const msg = await message.channel.send('Please enter a reason for the ban...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.');
			// eslint-disable-next-line no-shadow
			await message.channel.awaitMessages(msg => msg.author.id === message.author.id, { errors: ['time'], max: 1, time: 60000 }).then(resp => {
				// eslint-disable-next-line prefer-destructuring
				resp = resp.array()[0];
				if (resp.content.toLowerCase() === 'cancel') return msg.edit('Cancelled. The user has not been banned.');
				reason = resp.content;
				if (reason) {
					msg.delete();
				}
			}).catch(() => {
				msg.edit('Timed out. The user has not been banned.');
			});
		}

		if (reason) {
			message.guild.members.ban(target, { reason: `${message.author.tag}: ${reason}` });
			message.channel.send(`Successfully banned the user with the ID \`${target}\`.`);
		}
	}

};
