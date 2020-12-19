const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['set'],
			description: 'Set a default channel',
			category: 'Administrator',
			usage: '<option> <channel>',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [option]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const target = message.mentions.channels.filter(ch => ch.type === 'text' && ch.guild.id === message.guild.id).last() || message.channel;

		if (!option) {
			message.quote('Please provide an valid option.');
		}

		switch (option.toLowerCase()) {
			case 'moderation-channel':
				guildData.plugins.moderations = target.id;
				guildData.markModified('plugins.moderations');
				guildData.save();
				message.quote(`Moderation channel defined on <#${target.id}> !`);
				break;
			case 'audit-channel':
				guildData.plugins.audits = target.id;
				guildData.markModified('plugins.audits');
				guildData.save();
				message.quote(`Audit channel defined on <#${target.id}> !`);
				break;
			default:
				message.quote(`\`${option}\` is not a option!`);
		}
	}

};
