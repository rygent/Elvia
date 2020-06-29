const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['nick'],
			description: 'Assigns a nickname to a member! Use "clear" to remove the nickname!',
			category: 'moderation',
			usage: '<mention|id> <nickname/clear>',
			memberPerms: ['MANAGE_NICKNAMES'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.channel.send('Please mention a valid member!');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.channel.send(`You can't change **${member.user.username}**'s nickname! Their position is higher than you!`);
		}
		if (!member.manageable) return message.channel.send(`I can't change **${member.user.username}**'s nickname! Their role is higher than mine!`);

		const nickname = args.join(' ');

		return await nickname !== 'clear' ? member.setNickname(nickname).then(() =>
			// eslint-disable-next-line max-len
			message.channel.send(`The nickname **${nickname}** has been assigned to **${member.user.username}**!`)) : member.setNickname('').then(() => message.channel.send(`**${member.displayName}**'s nickname has been cleared!`));
	}

};
