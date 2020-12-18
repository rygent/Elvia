const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	/* eslint-disable consistent-return */
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			message.quote(`Hello **${message.author.username}**, my prefix on this server is \`${this.client.prefix}\`.\nUse \`${this.client.prefix}help\` to get the list of the commands!`);
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (message.guild) {
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						return message.quote(`You're missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, you need them to use this command.`);
					}
				}

				const clientPermCheck = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return message.quote(`I'm missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, I need them to use this command.`);
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					return message.quote('This command can only be ran in a NSFW marked channel.');
				}
			}

			if (command.disabled) {
				return message.quote('This command is currently disabled!');
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.quote('Only developers can use this command.');
			}

			command.run(message, args);
		}
	}

};
