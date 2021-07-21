const Slash = require('../Structures/Slash.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../Utils/Configuration.js');

module.exports = class extends Slash {

	constructor(...args) {
		super(...args, {
			description: 'Gets bot invite link'
		});
	}

	async run(interaction) {
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Click here to invite!')
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${Access.INVITE_PERMISSION}&scope=${Access.INVITE_SCOPE}`));

		return interaction.reply({ content: 'Invite me to your server!', components: [button], ephemeral: true });
	}

};
