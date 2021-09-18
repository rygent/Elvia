const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Setting.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.isCommand()) return;
		if (!interaction.inGuild()) return;

		const data = {};
		data.user = await this.client.findOrCreateUser({ id: interaction.user.id });

		if (interaction.inGuild()) {
			data.guild = await this.client.findOrCreateGuild({ id: interaction.guildId });
			data.member = await this.client.findOrCreateMember({ id: interaction.user.id, guildId: interaction.guildId });
		}

		const command = this.client.interactions.get(interaction.commandName);
		if (command) {
			try {
				await command.run(interaction, data);
			} catch (error) {
				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle('LINK')
						.setLabel('Support Server')
						.setURL(`https://discord.gg/${Access.InviteCode}`));

				this.client.logger.log({ content: error.stack, type: 'error' });
				return interaction.reply({ content: `Something went wrong, please report it to our **guild support**!`, components: [button], ephemeral: true });
			}
		}
	}

};
