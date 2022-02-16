const Interaction = require('../../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'emoji',
			subCommand: 'list',
			description: 'List server emojis.'
		});
	}

	async run(interaction) {
		const standardEmoji = [];
		const animatedEmoji = [];

		await interaction.guild.emojis.cache.forEach(x => {
			if (x.animated) {
				animatedEmoji.push(x.toString());
			} else {
				standardEmoji.push(x.toString());
			}
		});

		if (animatedEmoji.length === 0 && standardEmoji.length === 0) return interaction.reply({ content: 'There are no emojis in this server.', ephemeral: true });

		return interaction.reply({ content: `${standardEmoji.join(' ')} ${animatedEmoji.join(' ')}`, ephemeral: true });
	}

};
