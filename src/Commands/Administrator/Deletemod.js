const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['autodeletemodcommands'],
			description: 'Automatically delete commands on moderation.',
			category: 'Administrator',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD', 'MANAGE_MESSAGES']
		});
	}

	async run(message, _args, data) {
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setCustomId('enable')
				.setLabel('Enable'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('disable')
				.setLabel('Disable'));

		const msg = await message.reply({ content: 'Please select an option below!', components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then(async (interaction) => {
			switch (interaction.customId) {
				case 'enable': {
					data.guild.autoDeleteModCommands = true;
					await data.guild.save();
					return interaction.update({ content: 'Automatic delete is enabled.\nModeration commands will be automatically deleted!', components: [] });
				}
				case 'disable': {
					data.guild.autoDeleteModCommands = false;
					await data.guild.save();
					return interaction.update({ content: 'Automatic delete is disabled.\nModeration commands will no longer be automatically deleted!', components: [] });
				}
			}
		}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
