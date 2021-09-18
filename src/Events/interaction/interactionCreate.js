const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Setting.js');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;
		if (!interaction.inGuild()) return;

		const data = {};
		data.user = await this.client.findOrCreateUser({ id: interaction.user.id });

		if (interaction.inGuild()) {
			data.guild = await this.client.findOrCreateGuild({ id: interaction.guildId });
			data.member = await this.client.findOrCreateMember({ id: interaction.user.id, guildId: interaction.guildId });
		}

		const command = this.client.interactions.get(interaction.commandName);
		if (command) {
			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPerms ? this.client.defaultPerms.add(command.memberPerms) : this.client.defaultPerms;
				if (memberPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.member).missing(memberPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `You don't have *${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}* permission, you need it to continue this command!`, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
				if (clientPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `I don't have *${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}* permission, I need it to continue this command!`, ephemeral: true });
					}
				}
			}

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
