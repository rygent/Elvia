const Interaction = require('../../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, Util } = require('discord.js');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');
const { nanoid } = require('nanoid');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'emojis',
			subCommand: 'delete',
			description: 'Delete a server emoji.',
			memberPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
			clientPermissions: ['MANAGE_EMOJIS_AND_STICKERS']
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);

		const parseEmoji = Util.parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parseEmoji.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const [cancelId, deleteId] = ['cancel', 'delete'].map(type => `${type}-${nanoid()}`);
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Secondary)
				.setCustomId(cancelId)
				.setLabel('Cancel'))
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Danger)
				.setCustomId(deleteId)
				.setLabel('Delete'));

		return interaction.reply({ content: `Are you sure that you want to delete the \`:${emojis.name}:\` ${emojis} emoji?`, components: [button], fetchReply: true }).then(message => {
			const filter = (i) => [cancelId, deleteId].includes(i.customId);
			const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60_000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				switch (i.customId) {
					case cancelId:
						await collector.stop();
						return i.editReply({ content: 'Cancelation of the deletion of the emoji.', components: [] });
					case deleteId:
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
