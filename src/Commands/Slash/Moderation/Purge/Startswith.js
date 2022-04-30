const InteractionCommand = require('../../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['purge', 'starts-with'],
			description: 'Purge messages that starts with specified content in the channel.',
			memberPermissions: ['ManageMessages'],
			clientPermissions: ['ManageMessages']
		});
	}

	async run(interaction) {
		const content = await interaction.options.getString('content', true);
		const amount = await interaction.options.getInteger('amount');

		const fetch = await interaction.channel.messages.fetch({ limit: amount });
		const data = [];

		fetch.map(m => m).forEach(message => {
			if (message.content.startsWith(content) && !message.pinned) return data.push(message);
		});

		try {
			return interaction.channel.bulkDelete(data.length ? data : 1, true).then(async (message) => {
				if (!amount) {
					await interaction.reply({ content: `Successfully deleted **${message.size}** messages.` });
				} else {
					await interaction.reply({ content: `Successfully deleted **${message.size}**/**${amount}** messages.` });
				}
				setTimeout(() => interaction.deleteReply(), 10000);
			});
		} catch {
			return interaction.reply({ content: 'You can only delete the messages which are not older than 14 days.', ephemeral: true });
		}
	}

};