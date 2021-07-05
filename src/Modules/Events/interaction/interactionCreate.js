const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	/* eslint-disable consistent-return */
	async run(interaction) {
		if (!interaction.isCommand()) return;

		await this.client.application?.commands.fetch(interaction.commandId).catch(() => null);

		if (!interaction.guildId) return;

		const command = this.client.interactions.get(interaction.command.name);

		try {
			await command.run(interaction, interaction.options.map((get) => get.value));
		} catch (error) {
			await interaction.reply({ content: 'Something went wrong, please report it to our guild support!', ephemeral: true });
			return console.log(error);
		}
	}

};
