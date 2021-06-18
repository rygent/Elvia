const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Determine the sanctions given along with the warning limits.',
			category: 'Administrator',
			usage: '[sanction] [number/reset]',
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
			return message.reply(`Please specify a sanction to be given, \`kick\` or \`ban\`.`);
		}

		const number = args[1];
		if (number === 'reset') {
			if (sanction === 'kick') {
				guildData.plugins.warnsSanctions.kick = false;
				guildData.markModified('plugins.warnsSanctions');
				guildData.save();
				return message.reply(`Members will no longer be kicked automatically!`);
			}

			if (sanction === 'ban') {
				guildData.plugins.warnsSanctions.ban = false;
				guildData.markModified('plugins.warnsSanctions');
				guildData.save();
				return message.reply(`Members will no longer be banned automatically!`);
			}
		}

		if (!number || isNaN(number)) return message.reply('Please specify a valid number!');
		if (number < 1 || number > 10) return message.reply('Please specify a valid number between **1** and **10**!');

		if (sanction === 'kick') {
			guildData.plugins.warnsSanctions.kick = number;
			guildData.markModified('plugins.warnsSanctions');
			guildData.save();
			return message.reply(`\`${number}\` warnings will be given and sanction will be kicked from the server.`);
		}

		if (sanction === 'ban') {
			guildData.plugins.warnsSanctions.ban = number;
			guildData.markModified('plugins.warnsSanctions');
			guildData.save();
			return message.reply(`\`${number}\` warnings will be given and sanction will be banned from the server.`);
		}
	}

};
