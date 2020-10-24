const { Collection } = require('discord.js');
const Event = require('../../../structures/Event.js');

module.exports = class extends Event {

	/* eslint-disable consistent-return */ /* eslint-disable complexity */
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		const data = {};
		if (message.guild) {
			const guild = await this.client.findOrCreateGuild({ id: message.guild.id });
			data.guild = guild;
		}

		const prefixes = data.guild ? data.guild.prefix : this.client.prefix;

		if (message.content.match(mentionRegex)) {
			message.channel.send(`Hello, my prefix for this guild is **${prefixes}**`);
		}

		const userData = await this.client.findOrCreateUser({ id: message.author.id });
		data.userData = userData;

		if (message.guild) {
			const afkReason = data.userData.afk;
			if (afkReason) {
				data.userData.afk = null;
				await data.userData.save();
				this.client.embeds.afk('delete', message);
			}

			message.mentions.users.forEach(async (user) => {
				// eslint-disable-next-line no-shadow
				const userData = await this.client.findOrCreateUser({ id: user.id });
				if (userData.afk) {
					this.client.embeds.afk('current', message, user.tag, userData.afk);
				}
			});
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : prefixes;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (message.guild) {
				const memberPermCheck = command.memberPerms ? this.client.defaultPerms.add(command.memberPerms) : this.client.defaultPerms;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						return this.client.embeds.common('memberPerms', message, this.client.utils.formatArray(missing.map(this.client.utils.formatPerms)));
					}
				}

				const clientPermCheck = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return this.client.embeds.common('clientPerms', message, this.client.utils.formatArray(missing.map(this.client.utils.formatPerms)));
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					return this.client.embeds.common('nsfwOnly', message);
				}
			}

			if (command.ownerOnly && message.author.id !== this.client.owner) {
				return this.client.embeds.common('ownerOnly', message);
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
					return message.channel.send(`You must wait **${timeLeft.toFixed(1)}** second(s) to be able to run the \`${command.name}\` command again!`)
						.then(msg => msg.delete({ timeout: expirationTime - now }));
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				command.run(message, args, data);
				if (command.category === 'moderation' && data.guild.autoDeleteModCommands) {
					message.delete();
				}
			} catch (err) {
				console.log(err);
				return this.client.embeds.common(null, message);
			}
		}
	}

};
