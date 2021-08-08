const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['delete', 'purge'],
			description: 'Deletes messages very quickly!',
			category: 'Moderation',
			usage: '[number] (member)',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	async run(message, [number]) {
		let amount = number;
		if (!amount || isNaN(amount) || parseInt(amount) < 1) {
			return message.reply({ content: 'You must specify a number of messages to delete!' });
		}

		await message.delete();

		const member = message.mentions.members.first();

		let messages = await message.channel.messages.fetch({ limit: 100 });
		messages = [...messages.values()];
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
			toDelete = await message.channel.send({ content: `Successfully deleted \`${--amount}\` messages from **${member.displayName}**!` });
		} else {
			toDelete = await message.channel.send({ content: `Successfully deleted \`${--amount}\` messages!` });
		}

		setTimeout(() => {
			toDelete.delete();
		}, 3000);
	}

};
