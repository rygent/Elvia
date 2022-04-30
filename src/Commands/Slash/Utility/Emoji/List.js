const InteractionCommand = require('../../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'list'],
			description: 'List server emojis.'
		});
	}

	async run(interaction) {
		const standardEmoji = [];
		const animatedEmoji = [];

		await interaction.guild.emojis.cache.forEach(emoji => {
			if (emoji.animated) {
				animatedEmoji.push(emoji.toString());
			} else {
				standardEmoji.push(emoji.toString());
			}
		});

		if (!animatedEmoji.length && !standardEmoji.length) return interaction.reply({ content: 'There are no emojis in this server.', ephemeral: true });

		return interaction.reply({ content: `${standardEmoji.join(' ')} ${animatedEmoji.join(' ')}`, ephemeral: true });
	}

};
