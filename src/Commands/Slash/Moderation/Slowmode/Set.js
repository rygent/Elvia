import { Duration, DurationFormatter } from '@sapphire/time-utilities';
import Command from '../../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['slowmode', 'set'],
			description: 'Set slowmode duration.',
			memberPermissions: ['ManageChannels'],
			clientPermissions: ['ManageChannels']
		});
	}

	async run(interaction) {
		const duration = interaction.options.getString('duration', true);
		const channel = interaction.options.getChannel('channel') || interaction.channel;

		const parseDuration = new Duration(duration).offset / 1000;
		if (parseDuration < 1 || parseDuration > 21600) return interaction.reply({ content: 'Slowmode time must be a number between 1 second and 6 hours.', ephemeral: true });

		await channel.setRateLimitPerUser(parseDuration);

		return interaction.reply({ content: `Channel slowmode was updated, it is now set to **${new DurationFormatter().format(parseDuration * 1000)}**.` });
	}

}
