import Command from '../../../Structures/Command.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'restart',
			aliases: ['reboot'],
			description: 'Restart the bot.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		const [cancelId, restartId] = ['cancel', 'restart'].map(type => `${type}-${nanoid()}`);
		const button = (state) => new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel')
				.setDisabled(state))
			.addComponents(new ButtonBuilder()
				.setCustomId(restartId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Restart')
				.setDisabled(state));

		const reply = await message.reply({ content: 'Are you sure want to restart the bot ?', components: [button(false)] });

		const filter = (i) => i.user.id === message.author.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15_000 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			switch (i.customId) {
				case cancelId:
					collector.stop();
					return i.update({ content: 'Cancelation of restarting the bot.', components: [] });
				case restartId:
					setTimeout(async () => {
						await (reply.delete() && message.delete());
						return process.exit();
					}, 5000);
					return i.update({ content: 'The bot will restart in 5 seconds.\n*it may take a few minutes for it to boot up again*', components: [] });
			}
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return reply.edit({ components: [button(true)] });
			}
		});
	}

}
