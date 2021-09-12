const Command = require('../../Structures/Command.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Unmute for specific members!',
			category: 'Moderation',
			usage: '[member]',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	async run(message, [target], data) {
		const member = await Resolver.resolveMember({ message, target });
		if (!member) return message.reply({ content: 'Please specify valid member to unmuted' });
		const memberPosition = member.roles.highest.position;
		const moderationPosition = message.member.roles.highest.position;
		if (message.member.ownerID !== message.author.id && !(moderationPosition > memberPosition)) {
			return message.reply({ content: 'You can\'t unmute for a member who has an higher or equal role hierarchy to yours!' });
		}

		if (data.member.mute.muted) {
			data.member.mute.endDate = Date.now();
			data.member.markModified('mute');
			data.member.save();
			return message.reply({ content: `**${member.user.tag}** has just been unmuted!` });
		} else {
			return message.reply({ content: `**${member.user.tag}** is not muted on this server!` });
		}
	}

};
