const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Enables or disables the auto deletion of moderation commands!',
			category: 'Administrator',
			usage: '<on/off>',
			userPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [status]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (!status) {
			return message.quote(`You must specify \`on\` or \`off\`!`);
		}

		switch (status.toLowerCase()) {
			case 'on':
				guildData.autoDeleteModCommands = true;
				guildData.save();
				message.quote('Moderation commands will be automatically deleted!');
				break;
			case 'off':
				guildData.autoDeleteModCommands = false;
				guildData.save();
				message.quote('Moderation commands will no longer be automatically deleted!');
				break;
			default:
				message.quote(`You have to choose \`on\` or \`off\`!`);
		}
	}

};
