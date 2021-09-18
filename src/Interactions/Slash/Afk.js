const Interaction = require('../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'afk',
			description: 'Give reasons when AFK',
			options: [
				{ type: 1, name: 'set', description: 'Sets status when AFK', options: [
					{ type: 3, name: 'reason', description: 'Reason for being AFK', required: true }
				] }
			]
		});
	}

	async run(interaction, data) {
		const reason = interaction.options.getString('reason', true);

		data.user.afk.enabled = true;
		data.user.afk.since = Date.now();
		data.user.afk.reason = reason;
		data.user.markModified('afk');
		await data.user.save();

		return interaction.reply({ content: `You're now AFK!\n***Reason:*** ${reason}`, ephemeral: true });
	}

};
