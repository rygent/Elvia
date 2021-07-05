const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Leave a guild.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [id]) {
		if (!id) {
			return message.reply({ content: 'Please provide a guild ID!' });
		}

		const guild = this.client.guilds.cache.get(id);
		if (!guild) {
			return message.reply({ content: 'Invalid guild ID!' });
		}

		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirm')
				.setCustomId('confirm'))
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancel')
				.setCustomId('cancel'));

		return message.reply({ content: `Please confirm if you want to leave from the **${guild.name}** guild!`, components: [row] }).then(msg => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentCollector(filter, { time: 10000 });

			collector.on('collect', async (button) => {
				if (button.customId === 'confirm') {
					await guild.leave();
					return button.update({ content: `Successfully left guild **${guild.name}**!`, components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 10000));
				}

				if (button.customId === 'cancel') {
					collector.stop();
					return button.update({ content: 'Command has been cancelled!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 10000));
				}
			});

			collector.on('end', (collected) => {
				if (collected.size === 0) {
					return msg.edit({ content: 'Time has run out, please use the command again!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 5000));
				}
			});
		});
	}

};
