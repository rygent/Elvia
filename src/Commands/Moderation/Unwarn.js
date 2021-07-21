const Command = require('../../Structures/Command.js');

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

	async run(message, [target]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply({ content: 'Please specify valid member to remove the warning!' });

		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		memberData.sanctions = [];
		memberData.save();
		return message.reply({ content: `**${member.user.tag}**'s warning has been removed!` });
	}

};
