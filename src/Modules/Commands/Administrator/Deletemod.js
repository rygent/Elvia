const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Automatically delete commands on moderation.',
			category: 'Administrator',
			usage: '[enable/disable]',
			userPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [option]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (!option) {
			return message.reply(`You have to select the options to \`enable\` or \`disable\`!`);
		}

		switch (option.toLowerCase()) {
			case 'enable':
				guildData.autoDeleteModCommands = true;
				guildData.save();
				message.reply('Automatic delete is enabled.\nModeration commands will be automatically deleted!');
				break;
			case 'disable':
				guildData.autoDeleteModCommands = false;
				guildData.save();
				message.reply('Automatic delete is disabled.\nModeration commands will no longer be automatically deleted!');
				break;
			default:
				return message.reply(`This option is not found. Please select the option \`enable\` or \`disable\`!`);
		}
	}

};
