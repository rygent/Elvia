const Event = require('../../Structures/Event');

module.exports = class extends Event {

	async run(interaction) {
		if (!interaction.inGuild()) return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;

		const command = this.client.interactions.get(this.getCommandName(interaction));
		if (command) {
			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPermission ? this.client.defaultPermission.add(command.memberPermission) : this.client.defaultPermission;
				if (memberPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.member).missing(memberPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermission(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPermission ? this.client.defaultPermission.add(command.clientPermission) : this.client.defaultPermission;
				if (clientPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermission(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}
			}

			try {
				await command.run(interaction);
			} catch (error) {
				if (interaction.replied) return;
				this.client.logger.log({ content: error.stack, type: 'error' });

				if (interaction.deferred) {
					return interaction.editReply({ content: 'An unexpected error occurred.' });
				} else {
					return interaction.reply({ content: 'An unexpected error occurred.', ephemeral: true });
				}
			}
		}
	}

	getCommandName(interaction) {
		let command;
		// eslint-disable-next-line prefer-destructuring
		const commandName = interaction.commandName;
		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (subCommandGroup) {
				command = `${commandName}-${subCommandGroup}-${subCommand}`;
			} else {
				command = `${commandName}-${subCommand}`;
			}
		} else {
			command = commandName;
		}
		return command;
	}

};
