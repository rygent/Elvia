const Command = require('../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { parseEmoji } = require('discord.js');
const { nanoid } = require('nanoid');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['emojis', 'rename'],
			description: 'Rename a server emoji.',
			memberPermissions: ['ManageEmojisAndStickers'],
			clientPermissions: ['ManageEmojisAndStickers']
		});
	}

	async run(interaction) {
		const emoji = await interaction.options.getString('emoji', true);
		const name = await interaction.options.getString('name', true);

		const parse = parseEmoji(emoji);

		const emojis = await interaction.guild.emojis.cache.get(parse.id);
		if (!emojis.guild) return interaction.reply({ content: 'This emoji not from this guild', ephemeral: true });

		const [cancelId, confirmId] = ['cancel', 'confirm'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(confirmId)
				.setStyle(ButtonStyle.Success)
				.setLabel('Confirm'));

		const reply = await interaction.reply({ content: `Are you sure to rename \`:${emojis.name}:\` ${emojis} to \`:${name}:\`?`, components: [button] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60e3 });

		collector.on('collect', async (i) => {
			switch (i.customId) {
				case cancelId:
					await collector.stop();
					return i.update({ content: 'Cancelation of the emoji\'s name change.', components: [] });
				case confirmId:
					await emojis.edit({ name });
					return i.update({ content: `Emoji \`:${emojis.name}:\` ${emojis} was successfully renamed.`, components: [] });
			}
		});

		collector.on('ignore', (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate();
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

};
