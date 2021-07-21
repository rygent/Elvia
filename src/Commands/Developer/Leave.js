const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Leave a guild.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message, [id]) {
		if (!id) return message.reply({ content: 'Please provide a guild ID!' });

		const guild = await this.client.guilds.cache.get(id);
		if (!guild) return message.reply({ content: 'Invalid guild ID!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Confirm')
				.setCustomId('confirm'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Cancel')
				.setCustomId('cancel'));

		return message.reply({ content: `Please confirm if you want to leave from the **${guild.name}** guild!`, components: [button] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			msg.awaitMessageComponent({ filter, time: 15000 }).then(async (button) => {
				switch (button.customId) {
					case 'confirm': {
						await guild.leave();
						return button.update({ content: `Successfully left guild **${guild.name}**!`, components: [] });
					}
					case 'cancel': {
						return button.update({ content: 'Command has been cancelled!', components: [] });
					}
				}
			}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
		});
	}

};
