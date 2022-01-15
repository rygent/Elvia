const Interaction = require('../../../../Structures/Interaction.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'lovecalc',
			description: 'Calculate love percentage between two users.'
		});
	}

	async run(interaction) {
		const user1 = await interaction.options.getMember('user1', true);
		const user2 = await interaction.options.getMember('user2', true);

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		return await interaction.reply({ content: [
			`**${user1.displayName}** is ${Math.floor(love)}% in love with **${user2.displayName}**`,
			`${loveLevel}`
		].join('\n') });
	}

};
