const Command = require('../../../Structures/Command.js');
const { MessageSelectMenu } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Automatically delete commands on moderation.',
			category: 'Administrator',
			userPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });

		const menu = new MessageSelectMenu()
			.setCustomId('select')
			.setMaxValues(1)
			.addOptions([{
				label: 'Enable',
				description: 'Will be deleted automatically',
				value: 'enable'
			}, {
				label: 'Disable',
				description: 'Will not be deleted automatically',
				value: 'disable'
			}]);

		return message.reply({ content: 'Select the following options to define auto-delete moderation settings', components: [[menu]] }).then((msg) => {
			const filter = (select) => select.user.id === message.author.id;
			msg.awaitMessageComponent({ filter, time: 10000 }).then((select) => {
				switch (select.values[0]) {
					case 'enable':
						guildData.autoDeleteModCommands = true;
						guildData.save();
						return select.update({ content: 'Automatic delete is enabled.\nModeration commands will be automatically deleted!', components: [] });
					case 'disable':
						guildData.autoDeleteModCommands = false;
						guildData.save();
						return select.update({ content: 'Automatic delete is disabled.\nModeration commands will no longer be automatically deleted!', components: [] });
				}
			}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
		});
	}

};
