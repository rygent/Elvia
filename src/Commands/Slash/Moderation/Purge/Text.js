import Command from '../../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['purge', 'text'],
			description: 'Purge messages that contain text in the channel.',
			memberPermissions: ['ManageMessages'],
			clientPermissions: ['ManageMessages']
		});
	}

	async run(interaction) {
		const amount = interaction.options.getInteger('amount');
		await interaction.deferReply({ ephemeral: true });

		const messages = await interaction.channel.messages.fetch({ limit: 100, cache: true });
		const filter = messages.filter(m => !m.attachments.first() && !m.embeds.length && !m.pinned);
		const data = Array.from(filter.values());

		const deleted = await interaction.channel.bulkDelete(data.slice(0, amount || 1), true);

		const results = {};
		for (const [, message] of deleted) {
			const user = message.author.tag;
			if (!results[user]) results[user] = 0;
			results[user]++;
		}

		const replies = [
			`***${deleted.size}*** message(s) have been successfully deleted!`,
			`${Object.entries(results).map(([user, size]) => `*${user}:* ***${size}***`).join('\n')}`
		].join('\n\n');

		return interaction.editReply({ content: replies });
	}

}
