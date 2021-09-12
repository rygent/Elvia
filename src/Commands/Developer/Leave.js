const Command = require('../../Structures/Command.js');
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

	async run(message, [id]) {
		if (!id) return message.reply({ content: 'Please provide a guild ID!' });

		const guild = await this.client.guilds.cache.get(id);
		if (!guild) return message.reply({ content: 'Invalid guild ID!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setCustomId('confirm')
				.setLabel('Yep!'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('cancel')
				.setLabel('Cancel'));

		const msg = await message.reply({ content: `Please confirm if you want to leave from the **${guild.name}** guild!`, components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then(async (interaction) => {
			switch (interaction.customId) {
				case 'confirm': {
					await guild.leave();
					return interaction.update({ content: `Successfully left guild **${guild.name}**!`, components: [] });
				}
				case 'cancel': {
					return msg.delete() && message.delete();
				}
			}
		}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
