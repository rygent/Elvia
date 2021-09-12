const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Setting.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Gives you a bot invite link.',
			category: 'Utilities',
			cooldown: 3000
		});
	}

	async run(message) {
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Invite me!')
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${Access.InvitePermission}&scope=${Access.InviteScope.join('%20')}`))
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Vote me!')
				.setURL(`https://top.gg/bot/${this.client.user.id}/vote`));

		return message.reply({ content: 'Invite me to your server!', components: [button] });
	}

};
