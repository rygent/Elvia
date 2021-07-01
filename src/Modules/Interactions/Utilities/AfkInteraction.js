const Interaction = require('../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'afk',
			description: 'Set status when AFK',
			options: [{
				name: 'reason',
				type: 'STRING',
				description: 'Input your reason for being AFK',
				required: true
			}]
		});
	}

	async run(interaction, [reason]) {
		const userData = await this.client.findOrCreateUser({ id: interaction.user.id });

		userData.afk = reason;
		userData.save();

		return interaction.reply({ content: `You're now AFK!\n***Reason:*** ${reason}`, ephemeral: true });
	}

};
