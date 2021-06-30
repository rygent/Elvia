const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Delete all messages of the channel!',
			category: 'Moderation',
			userPerms: ['MANAGE_CHANNELS'],
			clientPerms: ['MANAGE_CHANNELS']
		});
	}

	/* eslint-disable consistent-return */
	async run(message) {
		if (!message.channel.deletable) return message.reply('This channel cannot be deleted!');

		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirm')
				.setCustomID('confirm'))
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancel')
				.setCustomID('cancel'));

		return message.reply({ content: 'Please confirm if you want to nuke this channel!', components: [row] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentInteractionCollector(filter, { time: 15000 });

			collector.on('collect', async (button) => {
				if (button.customID === 'confirm') {
					const { position, topic } = message.channel;
					const newChannel = await message.channel.clone();
					newChannel.setPosition(position);
					newChannel.setTopic(topic);
					await message.channel.delete(); // eslint-disable-next-line no-shadow
					return newChannel.send('Channel has been successfully nuked!').then((msg) => this.client.setTimeout(() => msg.delete(), 15000));
				}

				if (button.customID === 'cancel') {
					collector.stop();
					return button.update({ content: 'Command has been cancelled!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 5000));
				}
			});

			collector.on('end', (collected) => {
				if (collected.size === 0) msg.edit({ content: 'Time has run out, please use the command again!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 5000));
			});
		});
	}

};
