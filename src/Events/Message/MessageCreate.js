const Event = require('../../Structures/Event');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Collection } = require('discord.js');
const { Links } = require('../../Utils/Constants');
const { nanoid } = require('nanoid');
const ReportModal = require('../../Utils/Module/ReportModal');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'messageCreate',
			once: false
		});
	}

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);
		if (message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			return message.reply({ content: `My prefix here is \`${this.client.prefix}\`.` })
				.then(m => setTimeout(() => m.delete(), 10000));
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;
		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.guildOnly && !message.inGuild()) {
				return message.reply({ content: 'This command cannot be used out of a server.' })
					.then(m => setTimeout(() => m.delete(), 10000));
			}

			if (command.disabled && !this.client.utils.isOwner(message.author.id)) {
				return message.reply({ content: 'This command is currently inaccessible!' })
					.then(m => setTimeout(() => m.delete(), 10000));
			}

			if (message.inGuild()) {
				const memberPermCheck = command.memberPermissions ? this.client.defaultPermissions.add(command.memberPermissions) : this.client.defaultPermissions;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						return message.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.` })
							.then(m => setTimeout(() => m.delete() && message.delete(), 10000));
					}
				}

				const clientPermCheck = command.clientPermissions ? this.client.defaultPermissions.add(command.clientPermissions) : this.client.defaultPermissions;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.members.me).missing(clientPermCheck);
					if (missing.length) {
						return message.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermissions(perms)}***`))} permission(s) to continue.` })
							.then(m => setTimeout(() => m.delete() && message.delete(), 10000));
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					return message.reply({ content: 'This command is only accessible on NSFW channels!' })
						.then(m => setTimeout(() => m.delete() && message.delete(), 10000));
				}
			}

			if (command.ownerOnly && !this.client.utils.isOwner(message.author.id)) {
				return message.reply({ content: 'This command is only accessible for developers!' })
					.then(m => setTimeout(() => m.delete(), 10000));
			}

			if (!this.client.cooldown.has(command.name)) {
				this.client.cooldown.set(command.name, new Collection());
			}

			const current = Date.now();
			const cooldown = this.client.cooldown.get(command.name);

			if (cooldown.has(message.author.id) && !this.client.utils.isOwner(message.author.id)) {
				const expiration = cooldown.get(message.author.id) + command.cooldown;

				if (current < expiration) {
					const time = (expiration - current) / 1000;
					return message.reply({ content: `You've to wait **${time.toFixed(2)}** second(s) to continue.` })
						.then(m => setTimeout(() => m.delete(), expiration - current));
				}
			}

			cooldown.set(message.author.id, current);
			setTimeout(() => cooldown.delete(message.author.id), command.cooldown);

			try {
				await message.channel.sendTyping();
				await command.run(message, args);
			} catch (error) {
				this.client.logger.error(error.stack, { error });

				const buttonId = `button-${nanoid()}`;
				const button = (state) => new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Support Server')
						.setURL(Links.SupportServer)])
					.addComponents([new ButtonBuilder()
						.setCustomId(buttonId)
						.setStyle(ButtonStyle.Danger)
						.setLabel('Report bug')
						.setDisabled(state)]);

				const reply = await message.reply({ content: [
					'An error has occured when executing this command.',
					'If the issue persists, please report in our *Support Server*.'
				].join('\n'), components: [button(false)] });

				const filter = (i) => i.customId === buttonId;
				const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 600000 });

				const report = new ReportModal(this.client, { collector });

				collector.on('collect', (i) => {
					if (i.user.id !== message.author.id) return i.deferUpdate();
					return report.showModal(i);
				});

				collector.on('end', (collected, reason) => {
					if (reason === 'time' || reason === 'collected') {
						return reply.edit({ components: [button(true)] });
					}
				});
			}
		}
	}

};