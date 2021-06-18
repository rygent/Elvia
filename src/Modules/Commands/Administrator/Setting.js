const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['set'],
			description: 'Defines a channel for sending log history.',
			category: 'Administrator',
			usage: '[option] [channel]',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [option]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const target = message.mentions.channels.filter(ch => ch.type === 'text' && ch.guild.id === message.guild.id).last() || message.channel;

		if (!option) {
			return message.reply(`You have to select the options to \`moderation\` and \`message\`!`);
		}

		switch (option.toLowerCase()) {
			case 'moderation':
				guildData.plugins.moderations = target.id;
				guildData.markModified('plugins.moderations');
				guildData.save();
				message.reply(`Moderation log channels have been defined in <#${target.id}>`);
				break;
			case 'message':
				guildData.plugins.audits = target.id;
				guildData.markModified('plugins.audits');
				guildData.save();
				message.reply(`Message log channels have been defined in <#${target.id}>`);
				break;
			default:
				return message.reply(`This option is not found. Please select the option \`moderation\` and \`message\`!`);
		}
	}

};
