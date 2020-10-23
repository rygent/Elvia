const Event = require('../../../structures/Event.js');
const cmdCooldown = {};

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
						return this.client.embeds.common('memberPerms', message, this.client.functions.formatArray(missing.map(this.client.functions.formatPerms)));
					}
				}

				const clientPermCheck = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						return this.client.embeds.common('clientPerms', message, this.client.functions.formatArray(missing.map(this.client.functions.formatPerms)));
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					return this.client.embeds.common('nsfwOnly', message);
				}
			}

			if (command.ownerOnly && message.author.id !== this.client.owner) {
				return this.client.embeds.common('ownerOnly', message);
			}

			let uCooldown = cmdCooldown[message.author.id];
			if (!uCooldown) {
				cmdCooldown[message.author.id] = {};
				uCooldown = cmdCooldown[message.author.id];
			}
			const time = uCooldown[command.name] || 0;
			if (time && (time > Date.now())) {
				return message.channel.send(`You must wait **${Math.ceil((time - Date.now()) / 1000)}** second(s) to be able to run this command again!`)
					.then(msg => msg.delete({ timeout: time - Date.now() }));
			}
			cmdCooldown[message.author.id][command.name] = Date.now() + command.cooldown;

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
