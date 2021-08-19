const Interaction = require('../../Structures/Interaction.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'rps',
			description: 'Play Rock Paper Scissors with bot'
		});
	}

	async run(interaction) {
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

		await interaction.reply({ content: 'Choose one of the buttons below to start the game!', components: [button], ephemeral: true });

		const filter = (button) => button.user.id === interaction.user.id;
		interaction.channel.awaitMessageComponent({ filter, time: 15000 }).then((button) => {
			const winChoice = (button.customId === 'rock' && result === 'scissors') || (button.customId === 'paper' && result === 'rock') || (button.customId === 'scissors' && result === 'paper');

			if (winChoice) {
				return button.update({ content: `You won, you choose \`${button.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			} else if (button.customId === result) {
				return button.update({ content: `We tied, you choose \`${button.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			} else {
				return button.update({ content: `You lost, you choose \`${button.customId.toProperCase()}\` while I choose \`${result.toProperCase()}\`!`, components: [] });
			}
		}).catch(() => interaction.editReply({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
