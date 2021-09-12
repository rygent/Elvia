const Command = require('../../Structures/Command.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Remove warnings on certain members!',
			category: 'Moderation',
			usage: '[member]',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	async run(message, [target], data) {
		const member = await Resolver.resolveMember({ message, target });
		if (!member) return message.reply({ content: 'Please specify valid member to remove the warning!' });

		data.member.sanctions = [];
		data.member.save();
		return message.reply({ content: `**${member.user.tag}**'s warning has been removed!` });
	}

};
