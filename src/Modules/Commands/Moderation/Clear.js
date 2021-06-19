const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['clean', 'purge'],
			description: 'Deletes messages very quickly!',
			category: 'Moderation',
			usage: '[number] (member)',
			userPerms: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
			clientPerms: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		if (args[0] === 'all') {
			const row = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle('SUCCESS')
					.setLabel('Confirm')
					.setCustomID('confirm'))
				.addComponents(new MessageButton()
					.setStyle('DANGER')
					.setLabel('Cancel')
					.setCustomID('cancel'));

			return message.reply({ content: 'Please confirm if you want to delete all messages on this channel!', components: [row] }).then((msg) => {
				const filter = (button) => button.user.id === message.author.id;
				const collector = msg.createMessageComponentInteractionCollector(filter, { time: 10000 });

				collector.on('collect', async (button) => {
					if (button.customID === 'confirm') {
						const posChannel = message.channel.position;
						const newChannel = await message.channel.clone();
						await message.channel.delete();
						newChannel.setPosition(posChannel);
						return newChannel.send('Successfully deleted all messages').then((msge) => this.client.setTimeout(() => msge.delete(), 10000));
					}

					if (button.customID === 'cancel') {
						return msg.delete() && message.delete();
					}
				});

				collector.on('end', (collected) => {
					if (collected.size === 0) msg.edit({ content: 'Time has passed, please retype it if you want to continue!', components: [] });
				});
			});
		}

		let amount = args[0];
		if (!amount || isNaN(amount) || parseInt(amount) < 1) {
			return message.reply('You must specify a number of messages to delete!');
		}

		await message.delete();

		const member = message.mentions.members.first();

		let messages = await message.channel.messages.fetch({ limit: 100 });
		messages = messages.array();
		if (member) {
			messages = messages.filter(mbr => mbr.author.id === member.id);
		} else if (messages.length > amount) {
			messages.length = parseInt(amount, 10);
		}
		messages = messages.filter(msg => !msg.pinned);
		amount++;

		message.channel.bulkDelete(messages, true);

		let toDelete = null;

		if (member) {
			toDelete = await message.channel.send(`🗑️ **${--amount}** messages of **${member.user.tag}** deleted!`);
		} else {
			toDelete = await message.channel.send(`🗑️ **${--amount}** messages deleted!`);
		}

		setTimeout(() => {
			toDelete.delete();
		}, 2000);
	}

};
