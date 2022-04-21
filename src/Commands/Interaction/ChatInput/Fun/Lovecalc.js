const InteractionCommand = require('../../../../Structures/Interaction');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['lovecalc'],
			description: 'Calculate love percentage between two users.'
		});
	}

	async run(interaction) {
		const [user1, user2] = ['1st', '2nd'].map(name => interaction.options.getMember(name));

		const love = Math.random() * 100;
		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const content = [
			`**${user1.displayName}** is ${Math.floor(love)}% in love with **${user2.displayName}**`,
			`${loveLevel}`
		].join('\n');

		return interaction.reply({ content });
	}

};
