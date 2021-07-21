const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Automatically delete commands on moderation.',
			category: 'Administrator',
			usage: '[enable/disable]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES']
		});
	}

	async run(message, [option]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		if (!option) {
			return message.reply({ content: `You have to select the options to \`enable\` or \`disable\`!` });
		}

		switch (option.toLowerCase()) {
			case 'enable':
				guildData.autoDeleteModCommands = true;
				guildData.save();
				message.reply({ content: 'Automatic delete is enabled.\nModeration commands will be automatically deleted!' });
				break;
			case 'disable':
				guildData.autoDeleteModCommands = false;
				guildData.save();
				message.reply({ content: 'Automatic delete is disabled.\nModeration commands will no longer be automatically deleted!' });
				break;
			default:
				return message.reply({ content: `This option is not found. Please select the option \`enable\` or \`disable\`!` });
		}
	}

};
