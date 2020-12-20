const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['prune', 'clear', 'bulkdelete'],
			description: 'Deletes messages very quickly!',
			category: 'Moderation',
			usage: '<number-of-messages> [mention|id]',
			userPerms: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
			clientPerms: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		if (args[0] === 'all') {
			message.quote('All messages of the channel will be deleted! To confirm type `confirm`');
			await message.channel.awaitMessages(msg => (msg.author.id === message.author.id) && (msg.content === 'confirm'), {
				max: 1,
				time: 20000,
				errors: ['time']
			}).catch(() => {
				message.channel.send('Time\'s up! Please retype the command!');
				return;
			});
			const { position } = message.channel;
			const newChannel = await message.channel.clone();
			await message.channel.delete();
			newChannel.setPosition(position);
			return newChannel.send('Salon reinitialized!');
		}

		let amount = args[0];
		if (!amount || isNaN(amount) || parseInt(amount) < 1) {
			return message.quote('You must specify a number of messages to delete!');
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
