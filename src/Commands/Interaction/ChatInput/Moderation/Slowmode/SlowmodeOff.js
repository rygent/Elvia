const Interaction = require('../../../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'slowmode',
			subCommand: 'off',
			description: 'Turn off slowmode.',
			memberPermission: ['MANAGE_CHANNELS'],
			clientPermission: ['MANAGE_CHANNELS']
		});
	}

	async run(interaction) {
		const channel = await interaction.options.getChannel('channel') || interaction.channel;

		await channel.setRateLimitPerUser(0);

		return interaction.reply({ content: 'Channel slowmode was disabled.' });
	}

};
