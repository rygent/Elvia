const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Settings/Configuration.js');

module.exports = class extends Event {

	async run(message) {
		if (!message.inGuild() || message.author.bot) return;

		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.content.match(mentionRegex)) {
			return message.reply({ content: `The prefix for this server is \`${this.client.prefix}\`.` });
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.disabled && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply({ content: 'This command is currently inaccessible!' });
			}

			if (message.inGuild()) {
				const memberPermCheck = command.memberPermission ? this.client.defaultPermission.add(command.memberPermission) : this.client.defaultPermission;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						return message.reply({ content: `You lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermission(perms)}***`))} permission(s) to continue.` });
					}
				}

				const clientPermCheck = command.clientPermission ? this.client.defaultPermission.add(command.clientPermission) : this.client.defaultPermission;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return message.reply({ content: `I lack the ${this.client.utils.formatArray(missing.map(perms => `***${this.client.utils.formatPermission(perms)}***`))} permission(s) to continue.` });
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					return message.reply({ content: 'This command is only accessible on NSFW channels!' });
				}
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply({ content: 'This command is only accessible for developers!' });
			}

			try {
				await message.channel.sendTyping();
				await command.run(message, args);
			} catch (error) {
				this.client.logger.log({ content: error.stack, type: 'error' });

				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle('LINK')
						.setLabel('Support Server')
						.setURL(`https://discord.gg/${Access.InviteCode}`));

				return message.reply({ content: 'Something went wrong, please report it to our **guild support**!', components: [button] });
			}
		}
	}

};
