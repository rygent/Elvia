const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'lovecalc',
			description: 'Calculate love percentage between two users.'
		});
	}

	async run(interaction) {
		const user1 = await interaction.options.getMember('1st', true);
		const user2 = await interaction.options.getMember('2nd', true);

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		return interaction.reply({ content: [
			`**${user1.displayName}** is ${Math.floor(love)}% in love with **${user2.displayName}**`,
			`${loveLevel}`
		].join('\n') });
	}

};
