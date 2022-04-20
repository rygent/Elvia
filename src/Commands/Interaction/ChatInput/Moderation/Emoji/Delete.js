const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Util } = require('discord.js');
const { nanoid } = require('nanoid');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'delete'],
			description: 'Delete a server emoji.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);

		const parseEmoji = Util.parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parseEmoji.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const [cancelId, deleteId] = ['cancel', 'delete'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(deleteId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Delete'));

		const reply = await interaction.reply({ content: `Are you sure that you want to delete the \`:${emojis.name}:\` ${emojis} emoji?`, components: [button] });

		const filter = (i) => [cancelId, deleteId].includes(i.customId);
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

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
			if ((!collected.size || !collected.filter(({ user }) => user.id === interaction.user.id).size) && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

};
