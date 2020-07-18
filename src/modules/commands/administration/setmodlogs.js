const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Define the log channel!',
			category: 'administration',
			usage: '[mention-channel]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_GUILD'],
			cooldown: 3000
		});
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args, data) {
		const channel = message.mentions.channels.filter(ch => ch.type === 'text' && ch.guild.id === message.guild.id).first() || message.channel;

		data.guild.plugins.modlogs = channel.id;
		data.guild.markModified('plugins.modlogs');
		data.guild.save();

		this.client.embeds.common('commonSuccess', message, `Moderation logs channel defined on <#${channel.id}> !`);
	}

};
