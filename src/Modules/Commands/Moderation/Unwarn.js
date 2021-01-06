const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Clear a member sanctions!',
			category: 'Moderation',
			usage: '<@member>',
			userPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.quote('Please mention the member you wish to remove the sanctions from!');

		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		memberData.sanctions = [];
		memberData.save();
		return message.quote(`**${member.user.tag}**'s sanctions were deleted!`);
	}

};
