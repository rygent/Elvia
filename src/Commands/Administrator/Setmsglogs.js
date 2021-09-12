const Command = require('../../Structures/Command.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['msglogs'],
			description: 'Defines a channel for sending message log.',
			category: 'Administrator',
			usage: '[channel]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [target], data) {
		const isEnabled = Boolean(data.guild.plugins.messages);
		const resolveChannel = await Resolver.resolveChannel({ message, target });

		if (!resolveChannel && isEnabled) {
			data.guild.plugins.messages = null;
			data.guild.markModified('plugins.messages');
			await data.guild.save();
			return message.reply({ content: 'Message logs channel deleted!' });
		}

		const channel = resolveChannel || message.channel;
		data.guild.plugins.messages = channel.id;
		data.guild.markModified('plugins.messages');
		await data.guild.save();
		return message.reply({ content: `Message log channels have been defined in <#${channel.id}>` });
	}

};
