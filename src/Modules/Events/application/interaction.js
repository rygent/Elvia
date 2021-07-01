const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	/* eslint-disable consistent-return */
	async run(interaction) {
		if (!interaction.isCommand()) return;

		await this.client.application?.commands.fetch(interaction.commandID).catch(() => null);

		if (!interaction.guildID) return;

		try {
			const command = this.client.interactions.get(interaction.command.name);

			await command.run(interaction, interaction.options.map((get) => get.value));
		} catch (err) {
			await interaction.reply({ content: 'Something went wrong, please contact the developer to fix it!', ephemeral: true });
			return console.log(err);
		}
	}

};
