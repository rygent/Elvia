const Command = require('../../Structures/Command.js');
const Resolver = require('../../Modules/Resolver.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['modlogs'],
			description: 'Defines a channel for sending moderation log.',
			category: 'Administrator',
			usage: '[channel]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [target], data) {
		const isEnabled = Boolean(data.guild.plugins.moderations);
		const resolveChannel = await Resolver.resolveChannel({ message, target });

		if (!resolveChannel && isEnabled) {
			data.guild.plugins.moderations = null;
			data.guild.markModified('plugins.moderations');
			await data.guild.save();
			return message.reply({ content: 'Moderation logs channel deleted!' });
		}

		const channel = resolveChannel || message.channel;
		data.guild.plugins.moderations = channel.id;
		data.guild.markModified('plugins.moderations');
		await data.guild.save();
		return message.reply({ content: `Moderation log channels have been defined in <#${channel.id}>` });
	}

};
