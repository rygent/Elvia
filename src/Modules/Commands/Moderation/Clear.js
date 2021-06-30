const Command = require('../../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['delete', 'purge'],
			description: 'Deletes messages very quickly!',
			category: 'Moderation',
			usage: '[number] (member)',
			userPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [number, target]) {
		let amount = number;
		if (isNaN(amount) || parseInt(amount) < 1 || amount > 100) {
			return message.reply('Amount must be a valid number and between `0` below `100`!');
		}

		const member = await this.client.resolveMember(target, message.guild);

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
			toDelete = await message.channel.send(`Successfully deleted \`${--amount}\` messages from **${member.displayName}**!`);
		} else {
			toDelete = await message.channel.send(`Successfully deleted \`${--amount}\` messages!`);
		}

		setTimeout(() => {
			toDelete.delete();
		}, 2000);
	}

};
