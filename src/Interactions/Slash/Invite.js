const Interaction = require('../../Structures/Interaction.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Access } = require('../../Utils/Setting.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'invite',
			description: 'Gets bot invite link'
		});
	}

	async run(interaction) {
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Invite me!')
				.setURL(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${Access.InvitePermission}&scope=${Access.InviteScope.join('%20')}`))
			.addComponents(new MessageButton()
				.setStyle('LINK')
				.setLabel('Vote me!')
				.setURL(`https://top.gg/bot/${this.client.user.id}/vote`));

		return interaction.reply({ content: 'Invite me to your server!', components: [button], ephemeral: true });
	}

};
