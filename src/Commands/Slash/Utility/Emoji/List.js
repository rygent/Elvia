const Command = require('../../../../Structures/Interaction');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'list'],
			description: 'List server emojis.'
		});
	}

	async run(interaction) {
		const emoji = interaction.guild.emojis.cache.map(item => item.toString());
		if (!emoji.length) return interaction.reply({ content: 'There are no emojis in this server.', ephemeral: true });

		return interaction.reply({ content: `${emoji.join(' ')}`, ephemeral: true });
	}

};
