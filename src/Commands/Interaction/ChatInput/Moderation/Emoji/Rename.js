const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Util } = require('discord.js');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['emoji', 'rename'],
			description: 'Rename a server emoji.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);
		const name = await interaction.options.getString('name', true);

		const parseEmoji = Util.parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parseEmoji.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setCustomId('cancel')
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Success)
				.setCustomId('confirm')
				.setLabel('Confirm'));

		return interaction.reply({ content: `Are you sure to rename \`:${emojis.name}:\` ${emojis} to \`:${name}:\`?`, components: [button], fetchReply: true }).then(message => {
			const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				switch (i.customId) {
					case 'cancel':
						await collector.stop();
						return i.editReply({ content: 'Cancelation of the emoji\'s name change.', components: [] });
					case 'confirm':
						await emojis.edit({ name });
						return i.editReply({ content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully renamed.`, components: [] });
				}
			});

			collector.on('end', (collected, reason) => {
				if ((!collected.size || !collected.filter(({ user }) => user.id === interaction.user.id).size) && reason === 'time') {
					return interaction.deleteReply();
				}
			});
		});
	}

};
