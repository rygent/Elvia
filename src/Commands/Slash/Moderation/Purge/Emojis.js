import Command from '../../../../Structures/Interaction.js';
import { FormattedCustomEmoji, TwemojiRegex } from '@sapphire/discord-utilities';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['purge', 'emojis'],
			description: 'Purge messages that contain emojis in the channel.',
			memberPermissions: ['ManageMessages'],
			clientPermissions: ['ManageMessages']
		});
	}

	async run(interaction) {
		const amount = interaction.options.getInteger('amount');

		const fetch = await interaction.channel.messages.fetch({ limit: amount });
		const data = [];

		fetch.map(m => m).forEach(message => {
			if ((TwemojiRegex.test(message.content) || FormattedCustomEmoji.test(message.content)) && !message.pinned) return data.push(message);
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

}
