const Event = require('../../Structures/Event.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Settings/Configuration.js');

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
				if (command.nsfw && !message.channel.nsfw) {
					await message.channel.sendTyping();
					return message.reply({ content: 'This command is only accessible on NSFW channels!' });
				}
			}

			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				await message.channel.sendTyping();
				return message.reply({ content: 'This command is only accessible for developers!' });
			}

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
