const Interaction = require('../../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, Util } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'emoji',
			subCommand: 'delete',
			description: 'Delete a server emoji.',
			memberPerms: ['MANAGE_EMOJIS_AND_STICKERS'],
			clientPerms: ['MANAGE_EMOJIS_AND_STICKERS']
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);

		const parseEmoji = Util.parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parseEmoji.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('cancel')
				.setLabel('Cancel'))
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setCustomId('delete')
				.setLabel('Delete'));

		return interaction.reply({ content: `Are you sure that you want to delete the \`:${emojis.name}:\` ${emojis} emoji?`, components: [button], fetchReply: true }).then(message => {
			const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60_000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				switch (i.customId) {
					case 'cancel':
						await collector.stop();
						return i.editReply({ content: 'Cancelation of the deletion of the emoji.', components: [] });
					case 'delete':
						await emojis.delete();
						return i.editReply({ content: `Emoji \`:${emojis.name}:\` was successfully removed.`, components: [] });
				}
			});

			collector.on('end', (collected, reason) => {
				if ((collected.size === 0 || collected.filter(x => x.user.id === interaction.user.id).size === 0) && reason === 'time') {
					return interaction.deleteReply();
				}
			});
		});
	}

};
