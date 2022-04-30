const InteractionCommand = require('../../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['slowmode', 'off'],
			description: 'Turn off slowmode.',
			memberPermissions: ['ManageChannels'],
			clientPermissions: ['ManageChannels']
		});
	}

	async run(interaction) {
		const channel = await interaction.options.getChannel('channel') || interaction.channel;

		await channel.setRateLimitPerUser(0);

		return interaction.reply({ content: 'Channel slowmode was disabled.' });
	}

};
