const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Enables or disables the auto deletion of moderation commands!',
			category: 'administration',
			usage: '<on/off>',
			memberPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_GUILD', 'MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [status], data) {
		// eslint-disable-next-line no-mixed-operators
		if (!status || status !== 'on' && status !== 'off') {
			return this.client.embeds.common('commonError', message, `You must specify \`on\` or \`off\` !`);
		}
		if (status === 'on') {
			data.guild.autoDeleteModCommands = true;
			data.guild.save();
			this.client.embeds.common('commonSuccess', message, 'Moderation commands will be automatically deleted!');
		} else {
			data.guild.autoDeleteModCommands = false;
			data.guild.save();
			this.client.embeds.common('commonSuccess', message, 'Moderation commands will no longer be automatically deleted!');
		}
	}

};
