const Event = require('../../Structures/Event.js');
const { Access, Color } = require('../../Utils/Configuration.js');

module.exports = class extends Event {

	async run(interaction) {
		if (interaction.isCommand()) {
			await this.client.application?.commands.fetch(interaction.commandId).catch(() => null);
			if (!interaction.guildId) return;

			const command = this.client.slashes.get(interaction.commandName);

			try {
				await command.run(interaction);
			} catch (error) {
				await interaction.reply({ embeds: [{
					color: Color.DEFAULT,
					description: `Something went wrong, please report it to our **[guild support](https://discord.gg/${Access.INVITE_CODE})**!`
				}], ephemeral: true });
				return this.client.logger.log({ content: error.stack, type: 'error' });
			}
		}
	}

};
