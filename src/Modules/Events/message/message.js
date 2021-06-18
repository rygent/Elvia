const { Collection } = require('discord.js');
const Event = require('../../../Structures/Event.js');

module.exports = class extends Event {

	/* eslint-disable consistent-return */ /* eslint-disable complexity */
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const customPrefix = guildData ? guildData.prefix : this.client.prefix;

		if (message.content.match(mentionRegex)) {
			return message.quote(`Hello **${message.author.username}**, my prefix on this server is \`${customPrefix}\`.\nUse \`${customPrefix}help\` to get the list of the commands!`);
		}

		const userData = await this.client.findOrCreateUser({ id: message.author.id });

		if (message.guild) {
			const afkReason = userData.afk;
			if (afkReason) {
				userData.afk = null;
				await userData.save();
				return message.quote(`**${message.author.username}**, your AFK status has just been deleted!`).then(msg => this.client.setTimeout(() => msg.delete(), 5000));
			}

			message.mentions.users.forEach(async (user) => {
				const dataUser = await this.client.findOrCreateUser({ id: user.id });
				if (dataUser.afk) {
					return message.quote(`**${user.tag}** is currently AFK!\nReason: ${dataUser.afk}`).then(msg => this.client.setTimeout(() => msg.delete(), 15000));
				}
			});
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : customPrefix;

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

			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps = this.client.cooldowns.get(command.name);
			const cooldownAmount = command.cooldown;

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.channel.send(`You must wait **${timeLeft.toFixed(2)}** second(s) to be able to run the \`${command.name}\` command again!`)
						.then(msg => this.client.setTimeout(() => msg.delete(), expirationTime - now));
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				command.run(message, args);
				if (command.category === 'Moderation' && guildData.autoDeleteModCommands) {
					message.delete();
				}
			} catch (err) {
				console.log(err);
				return message.quote('Something went wrong... Please retry again later!');
			}
		}
	}

};
