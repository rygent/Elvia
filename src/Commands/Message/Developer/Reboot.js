const MessageCommand = require('../../../Structures/Command');
const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');

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
		const button = (state) => new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId('cancel')
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel')
				.setDisabled(state))
			.addComponents(new ButtonBuilder()
				.setCustomId('restart')
				.setStyle(ButtonStyle.Danger)
				.setLabel('Restart')
				.setDisabled(state));

		const reply = await message.reply({ content: 'Are you sure want to restart the bot ?', components: [button(false)] });
		const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

		collector.on('collect', async (i) => {
			if (i.user.id !== message.author.id) return i.deferUpdate();

			switch (i.customId) {
				case 'cancel':
					collector.stop();
					return i.update({ content: 'Cancelation of restarting the bot.', components: [] });
				case 'restart':
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
