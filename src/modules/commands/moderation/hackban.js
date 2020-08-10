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
		if (isNaN(parseInt(target)) || target.length !== 18) return this.client.embeds.common('commonError', message, 'Please input a valid user ID!');
		if (target === this.client.user.id) return this.client.embeds.common('commonError', message, 'Please don\'t banned me...!');
		if (target === message.author.id) return this.client.embeds.common('commonError', message, 'You can\'t banned yourself!');
		if (target === this.client.owner) return this.client.embeds.common('commonError', message, 'I can\'t banned my master');

		if (message.guild.members.cache.get(target)) {
			return this.client.embeds.common('commonError', message, 'That user is in the server, hackban is meant to ban people who isn\'t in the server to prevent them from (re)joining in the future.');
		}

		const reason = args.join(' ');
		if (!reason) return this.client.embeds.common('commonError', message, 'Please provide a reason');

		message.guild.members.ban(target, { reason: `${message.author.tag}: ${reason}` });
		this.client.embeds.common('commonSuccess', message, `User with ID \`${target}\` has been banned.`);
	}

};
