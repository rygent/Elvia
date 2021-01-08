const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Define the sanctions that members will get after a certain number of warns!',
			category: 'Administrator',
			usage: '<kick/ban> <number/reset>',
			userPerms: ['MANAGE_GUILD', 'BAN_MEMBERS', 'KICK_MEMBERS'],
			clientPerms: ['MANAGE_GUILD', 'BAN_MEMBERS', 'KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		const sanction = args[0];
		if (!sanction || (sanction !== 'kick' && sanction !== 'ban')) {
			message.quote('Please specify sanction between `kick` and `ban`');
		}

		const number = args[1];
		if (number === 'reset') {
			if (sanction === 'kick') {
				guildData.plugins.warnsSanctions.kick = false;
				guildData.markModified('plugins.warnsSanctions');
				guildData.save();
				return message.quote(`**Members can no longer be automatically kicked!**\n\n*Send \`${guildData.prefix}config\` to see the updated configuration!*`);
			}

			if (sanction === 'ban') {
				guildData.plugins.warnsSanctions.ban = false;
				guildData.markModified('plugins.warnsSanctions');
				guildData.save();
				return message.quote(`**Members can no longer be automatically banned!**\n\n*Send \`${guildData.prefix}config\` to see the updated configuration!*`);
			}
		}

		if (!number || isNaN(number)) return message.quote('Please specify a valid number!');
		if (number < 1 || number > 10) return message.quote('Please specify a valid number between **1** and **10**!');

		if (sanction === 'kick') {
			guildData.plugins.warnsSanctions.kick = number;
			guildData.markModified('plugins.warnsSanctions');
			guildData.save();
			return message.quote(`**\`${number}\` warnings will result in an expulsion!**\n\n*Send \`${guildData.prefix}config\` to see the updated configuration!*`);
		}

		if (sanction === 'ban') {
			guildData.plugins.warnsSanctions.ban = number;
			guildData.markModified('plugins.warnsSanctions');
			guildData.save();
			return message.quote(`**\`${number}\` warnings will result in a ban!**\n\n*Send \`${guildData.prefix}config\` to see the updated configuration!*`);
		}
	}

};
