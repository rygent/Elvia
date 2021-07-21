const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Delete all messages of the channel!',
			category: 'Moderation',
			memberPerms: ['MANAGE_CHANNELS'],
			clientPerms: ['MANAGE_CHANNELS']
		});
	}

	async run(message) {
		if (!message.channel.deletable) return message.reply({ content: 'This channel cannot be deleted!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Confirm')
				.setCustomId('confirm'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Cancel')
				.setCustomId('cancel'));

		return message.reply({ content: 'Please confirm if you want to nuke this channel!', components: [button] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			msg.awaitMessageComponent({ filter, time: 15000 }).then(async (button) => {
				switch (button.customId) {
					case 'confirm': {
						const { position, topic } = message.channel;
						const newChannel = await message.channel.clone();
						newChannel.setPosition(position);
						newChannel.setTopic(topic);
						await message.channel.delete();
						return newChannel.send({ content: 'Channel has been successfully nuked!' }).then((msg) => setTimeout(() => msg.delete(), 10000));
					}
					case 'cancel': {
						return button.update({ content: 'Command has been cancelled!', components: [] });
					}
				}
			}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
		});
	}

};
