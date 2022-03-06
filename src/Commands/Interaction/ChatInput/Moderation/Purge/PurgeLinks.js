const Interaction = require('../../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'purge',
			subCommand: 'links',
			description: 'Purge messages that contain links in the channel.',
			memberPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES']
		});
	}

	async run(interaction) {
		const amount = await interaction.options.getInteger('amount');
		const regex = RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/ig);

		const fetch = await interaction.channel.messages.fetch({ limit: amount });
		const data = [];

		fetch.map(m => m).forEach(message => {
			if (regex.test(message.content) && !message.pinned) return data.push(message);
		});

		try {
			return interaction.channel.bulkDelete(data.length ? data : 1, true).then(async (message) => {
				if (!amount) {
					await interaction.reply({ content: `Successfully deleted **${message.size}** messages.` });
				} else {
					await interaction.reply({ content: `Successfully deleted **${message.size}**/**${amount}** messages.` });
				}
				setTimeout(() => interaction.deleteReply(), 10_000);
			});
		} catch {
			return interaction.reply({ content: 'You can only delete the messages which are not older than 14 days.', ephemeral: true });
		}
	}

};
