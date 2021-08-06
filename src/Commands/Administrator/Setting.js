const Command = require('../../Structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['set'],
			description: 'Defines a channel for sending log history.',
			category: 'Administrator',
			usage: '[option] [channel]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [option]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const target = message.mentions.channels.filter(channel => channel.isText() && channel.guild.id === message.guild.id).last() || message.channel;

		if (!option) {
			return message.reply({ content: `You have to select the options to \`moderation\` and \`message\`!` });
		}

		switch (option.toLowerCase()) {
			case 'moderation':
				guildData.plugins.moderations = target.id;
				guildData.markModified('plugins.moderations');
				guildData.save();
				message.reply({ content: `Moderation log channels have been defined in <#${target.id}>` });
				break;
			case 'message':
				guildData.plugins.audits = target.id;
				guildData.markModified('plugins.audits');
				guildData.save();
				message.reply({ content: `Message log channels have been defined in <#${target.id}>` });
				break;
			default:
				return message.reply({ content: `This option is not found. Please select the option \`moderation\` and \`message\`!` });
		}
	}

};
