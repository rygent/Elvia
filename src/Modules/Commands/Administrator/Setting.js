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
			this.client.reply.message('msgError', message, 'Please provide an valid option.');
		}

		switch (option.toLowerCase()) {
			case 'moderation-channel':
				guildData.plugins.moderations = target.id;
				guildData.markModified('plugins.moderations');
				guildData.save();
				this.client.reply.message('msgSuccess', message, `Moderation channel defined on <#${target.id}> !`);
				break;
			default:
				this.client.reply.message('msgError', message, `\`${option}\` is not a option!`);
		}
	}

};
