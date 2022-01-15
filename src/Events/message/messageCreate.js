const Event = require('../../Structures/Event.js');
const { Collection, MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Configuration.js');

module.exports = class extends Event {

	async run(message) {
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);
		if (!message.guild || message.author.bot) return;

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.disabled) {
				await message.channel.sendTyping();
				return message.reply({ content: 'This command is currently inaccessible!' });
			}

			if (message.guild) {
				const memberPermCheck = command.memberPerms ? this.client.defaultPerms.add(command.memberPerms) : this.client.defaultPerms;
				if (memberPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(memberPermCheck);
					if (missing.length) {
						await message.channel.sendTyping();
						return message.reply({ content: `You don't have *${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}* permission, you need it to continue this command!` });
					}
				}

				const clientPermCheck = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
				if (clientPermCheck) {
					const missing = message.channel.permissionsFor(message.guild.me).missing(clientPermCheck);
					if (missing.length) {
						await message.channel.sendTyping();
						return message.reply({ content: `I don't have *${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}* permission, I need it to continue this command!` });
					}
				}

				if (command.nsfw && !message.channel.nsfw) {
					await message.channel.sendTyping();
					return message.reply({ content: 'This command is only accessible on NSFW channels!' });
				}
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				await message.channel.sendTyping();
				return message.reply({ content: 'This command is only accessible for developers!' });
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
					await message.channel.sendTyping();
					return message.reply({ content: `You've to wait **${timeLeft.toFixed(2)}** second(s) before you can use this command again!` })
						.then(m => setTimeout(() => m.delete(), expirationTime - now));
				}
			}
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			try {
				await message.channel.sendTyping();
				await command.run(message, args);
			} catch (error) {
				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle('LINK')
						.setLabel('Support Server')
						.setURL(`https://discord.gg/${Access.InviteCode}`));

				this.client.logger.log({ content: error.stack, type: 'error' });
				return message.reply({ content: 'Something went wrong, please report it to our **guild support**!', components: [button] });
			}
		}
	}

};
