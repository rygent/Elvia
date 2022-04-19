const Event = require('../../Structures/Event');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Links } = require('../../Utils/Constants');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate',
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.inGuild()) return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

		const command = this.client.interactions.get(this.getCommandName(interaction));
		if (command) {
			if (interaction.inGuild()) {
				const memberPermCheck = command.memberPermissions ? this.client.defaultPermissions.add(command.memberPermissions) : this.client.defaultPermissions;
				if (memberPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.member).missing(memberPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}

				const clientPermCheck = command.clientPermissions ? this.client.defaultPermissions.add(command.clientPermissions) : this.client.defaultPermissions;
				if (clientPermCheck) {
					const missing = interaction.channel.permissionsFor(interaction.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}
			}

			try {
				await command.run(interaction);
			} catch (error) {
				if (interaction.replied) return;
				this.client.logger.error(error.stack);

				const content = [
					'An error has occured when executing this command, our developers have been informed.',
					'If the issue persists, please contact us in our **Support Server**.'
				].join('\n');

				const button = new ActionRowBuilder()
					.addComponents(new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Support Server')
						.setURL(Links.SupportServer));

				if (interaction.deferred) {
					return interaction.editReply({ content, components: [button] });
				} else {
					return interaction.reply({ content, components: [button], ephemeral: true });
				}
			}
		}
	}

	getCommandName(interaction) {
		let command;
		const { commandName } = interaction;
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
