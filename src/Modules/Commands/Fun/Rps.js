const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Play rock paper scissors game.',
			category: 'Fun',
			cooldown: 3000
		});
	}

	async run(message) {
		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Rock')
				.setEmoji('🪨')
				.setCustomID('rock'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Paper')
				.setEmoji('📄')
				.setCustomID('paper'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Scissors')
				.setEmoji('✂️')
				.setCustomID('scissors'));

		const choices = ['rock', 'paper', 'scissors'];
		const result = choices[Math.floor(Math.random() * 3)];

		return message.reply({ content: 'Choose one of the buttons below to start the game!', components: [row] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentInteractionCollector(filter, { time: 30000 });

			collector.on('collect', async (button) => {
				const winChoice = (button.customID === 'rock' && result === 'scissors') || (button.customID === 'paper' && result === 'rock') || (button.customID === 'scissors' && result === 'paper');

				if (winChoice) {
					return msg.edit({ content: `You won, you choose \`${button.customID.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
				} else if (button.customID === result) {
					return msg.edit({ content: `We tied, you choose \`${button.customID.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
				} else {
					return msg.edit({ content: `You lost, you choose \`${button.customID.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
				}
			});

			collector.on('end', (collected) => {
				if (collected.size === 0) msg.edit({ content: 'Time is up, please try again next time!', components: [] });
			});
		});
	}

};
