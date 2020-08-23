const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['log', 'logging'],
			description: 'Configures logging settings (messages, users, audit logs, etc).',
			category: 'administration',
			usage: '<moderation|messages> [mention-channel]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	async run(message, [type], data) {
		if (!type) this.client.embeds.common('commonError', message, 'Please enter a valid logging type (example: messages / moderation)!');
		if (type === 'moderation') {
			const channel = message.mentions.channels.filter(ch => ch.type === 'text' && ch.guild.id === message.guild.id).last() || message.channel;

			data.guild.plugins.modlogs = channel.id;
			data.guild.markModified('plugins.modlogs');
			data.guild.save();

			this.client.embeds.common('commonSuccess', message, `Moderation logs channel defined on <#${channel.id}> !`);
		}

		if (type === 'messages') {
			const channel = message.mentions.channels.filter(ch => ch.type === 'text' && ch.guild.id === message.guild.id).last() || message.channel;

			data.guild.plugins.msglogs = channel.id;
			data.guild.markModified('plugins.msglogs');
			data.guild.save();

			this.client.embeds.common('commonSuccess', message, `Messages logs channel defined on <#${channel.id}> !`);
		}
	}

};
