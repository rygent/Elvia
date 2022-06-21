const Command = require('../../../../Structures/Interaction');
const moment = require('moment');
const ms = require('ms');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['slowmode', 'set'],
			description: 'Set slowmode duration.',
			memberPermissions: ['ManageChannels'],
			clientPermissions: ['ManageChannels']
		});
	}

	async run(interaction) {
		const duration = await interaction.options.getString('duration', true);
		const channel = await interaction.options.getChannel('channel') || interaction.channel;

		const parsedDuration = ms(duration) / 1e3;
		if (parsedDuration < 1 || parsedDuration > 21600) return interaction.reply({ content: 'Slowmode time must be a number between 1 second and 6 hours.', ephemeral: true });

		await channel.setRateLimitPerUser(parsedDuration);

		return interaction.reply({ content: `Channel slowmode was updated, it is now set to **${moment.duration(parsedDuration * 1e3).format('H [hours], m [minutes], s [seconds]', { trim: 'both' })}**.` });
	}

};
