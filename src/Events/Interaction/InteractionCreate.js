import Event from '../../Structures/Event.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { Collection } from '@discordjs/collection';
import { Links } from '../../Utils/Constants.js';
import { nanoid } from 'nanoid';
import ReportModal from '../../Modules/ReportModal.js';

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate',
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

		const command = this.client.interactions.get(this.getCommandName(interaction));
		if (command) {
			if (command.disabled && !this.client.owners.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is currently inaccessible.', ephemeral: true });
			}

			if (command.guildOnly && !interaction.inGuild()) {
				return interaction.reply({ content: 'This command cannot be used out of a server.', ephemeral: true });
			}

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
					const missing = interaction.channel.permissionsFor(interaction.guild.members.me).missing(clientPermCheck);
					if (missing.length) {
						return interaction.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.`, ephemeral: true });
					}
				}
			}

			if (command.ownerOnly && !this.client.owners.includes(interaction.user.id)) {
				return interaction.reply({ content: 'This command is only accessible for developers.', ephemeral: true });
			}

			if (!this.client.cooldown.has(this.getCommandName(interaction))) {
				this.client.cooldown.set(this.getCommandName(interaction), new Collection());
			}

			const current = Date.now();
			const cooldown = this.client.cooldown.get(this.getCommandName(interaction));

			if (cooldown.has(interaction.user.id) && !this.client.owners.includes(interaction.user.id)) {
				const expiration = cooldown.get(interaction.user.id) + command.cooldown;

				if (current < expiration) {
					const time = (expiration - current) / 1000;
					return interaction.reply({ content: `You've to wait **${time.toFixed(2)}** second(s) to continue.`, ephemeral: true });
				}
			}

			cooldown.set(interaction.user.id, current);
			setTimeout(() => cooldown.delete(interaction.user.id), command.cooldown);

			try {
				await command.run(interaction);
			} catch (error) {
				if (interaction.replied || error.name === 'DiscordAPIError[10062]') return;
				this.client.logger.error(error.stack, error);

				const content = [
					'An error has occured when executing this command.',
					'If the issue persists, please report in our *Support Server*.'
				].join('\n');

				const buttonId = `button-${nanoid()}`;
				const button = (state) => new ActionRowBuilder()
					.addComponents(new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Support Server')
						.setURL(Links.SupportServer))
					.addComponents(new ButtonBuilder()
						.setCustomId(buttonId)
						.setStyle(ButtonStyle.Danger)
						.setLabel('Report bug')
						.setDisabled(state));

				let reply;
				if (interaction.deferred) reply = await interaction.editReply({ content, components: [button(false)] });
				else reply = await interaction.reply({ content, components: [button(false)], ephemeral: true });

				const filter = (i) => i.user.id === interaction.user.id;
				const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 600_000 });

				const report = new ReportModal(this.client, { collector });

				collector.on('collect', (i) => report.showModal(i));

				collector.on('ignore', (i) => {
					if (i.user.id !== interaction.user.id) return i.deferUpdate();
				});

				collector.on('end', (collected, reason) => {
					if (reason === 'time' || reason === 'collected') {
						return interaction.editReply({ components: [button(true)] });
					}
				});
			}
		}
	}

	getCommandName(interaction) {
		let command;
		const { commandName } = interaction;
		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		if (subCommand) {
			if (subCommandGroup) command = `${commandName}-${subCommandGroup}-${subCommand}`;
			else command = `${commandName}-${subCommand}`;
		} else {
			command = commandName;
		}
		return command;
	}

}
