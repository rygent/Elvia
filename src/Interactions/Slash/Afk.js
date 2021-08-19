const Interaction = require('../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'afk',
			description: 'Give reasons when AFK',
			options: [{
				type: 'SUB_COMMAND',
				name: 'set',
				description: 'Sets status when AFK',
				options: [{
					type: 'STRING',
					name: 'reason',
					description: 'Reason for being AFK',
					required: true
				}]
			}]
		});
	}

	async run(interaction) {
		const reason = interaction.options.getString('reason', true);

		const userData = await this.client.findOrCreateUser({ id: interaction.user.id });

		userData.afk.isAfk = true;
		userData.afk.sinceDate = Date.now();
		userData.afk.reason = reason;
		userData.markModified('afk');
		await userData.save();

		return interaction.reply({ content: `You're now AFK!\n***Reason:*** ${reason}`, ephemeral: true });
	}

};
