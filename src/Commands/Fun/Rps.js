const Command = require('../../Structures/Command.js');
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
		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Rock')
				.setEmoji('🪨')
				.setCustomId('rock'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Paper')
				.setEmoji('📄')
				.setCustomId('paper'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Scissors')
				.setEmoji('✂️')
				.setCustomId('scissors'));

		const choices = ['rock', 'paper', 'scissors'];
		const result = choices[Math.floor(Math.random() * 3)];

		const m = await message.reply({ content: 'Choose one of the buttons below to start the game!', components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then((interaction) => {
			const winChoice = (interaction.customId === 'rock' && result === 'scissors') || (interaction.customId === 'paper' && result === 'rock') || (interaction.customId === 'scissors' && result === 'paper');

			if (winChoice) {
				return interaction.update({ content: `You won, you choose \`${interaction.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			} else if (interaction.customId === result) {
				return interaction.update({ content: `We tied, you choose \`${interaction.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			} else {
				return interaction.update({ content: `You lost, you choose \`${interaction.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			}
		}).catch(() => m.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
