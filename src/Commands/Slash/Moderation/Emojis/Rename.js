import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { parseEmoji } from 'discord.js';
import { nanoid } from 'nanoid';

export default class extends Command {

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
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60_000 });

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

}
