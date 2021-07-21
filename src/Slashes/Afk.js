const Slash = require('../Structures/Slash.js');

module.exports = class extends Slash {

	constructor(...args) {
		super(...args, {
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

		userData.afk = reason;
		userData.save();

		return interaction.reply({ content: `You're now AFK!\n***Reason:*** ${reason}`, ephemeral: true });
	}

};
