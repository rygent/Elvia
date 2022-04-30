const MessageCommand = require('../../../Structures/Command');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { nanoid } = require('nanoid');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			name: 'reboot',
			aliases: ['restart'],
			description: 'Restart the bot.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		const [cancelId, restartId] = ['cancel', 'restart'].map(type => `${type}-${nanoid()}`);
		const button = (state) => new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel')
				.setDisabled(state)])
			.addComponents([new ButtonBuilder()
				.setCustomId(restartId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Restart')
				.setDisabled(state)]);

		const reply = await message.reply({ content: 'Are you sure want to restart the bot ?', components: [button(false)] });

		const filter = (i) => [cancelId, restartId].includes(i.customId);
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15000 });

		collector.on('collect', async (i) => {
			if (i.user.id !== message.author.id) return i.deferUpdate();

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

		collector.on('end', () => reply.edit({ components: [button(true)] }));
	}

};
