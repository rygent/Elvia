const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Unmute for specific members!',
			category: 'Moderation',
			usage: '[member]',
			userPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply('Please specify valid member to unmuted');
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply('You can\'t unmute for a member who has an higher or equal role hierarchy to yours!');
		}

		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (memberData.mute.muted) {
			memberData.mute.endDate = Date.now();
			memberData.markModified('mute');
			memberData.save();
			return message.reply(`**${member.user.tag}** has just been unmuted!`);
		} else {
			return message.reply(`**${member.user.tag}** is not muted on this server!`);
		}
	}

};
