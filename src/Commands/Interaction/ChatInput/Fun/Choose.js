const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'choose',
			description: 'Let me make a choice for you.'
		});
	}

	async run(interaction) {
		const first = await interaction.options.getString('1st', true);
		const second = await interaction.options.getString('2nd', true);
		const third = await interaction.options.getString('3rd');
		const fourth = await interaction.options.getString('4th');
		const fifth = await interaction.options.getString('5th');
		const sixth = await interaction.options.getString('6th');
		const seventh = await interaction.options.getString('7th');
		const eighth = await interaction.options.getString('8th');
		const ninth = await interaction.options.getString('9th');
		const tenth = await interaction.options.getString('10th');

		const choice = [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth];
		const filter = choice.filter(x => x !== null);
		const choose = choice[Math.floor(Math.random() * filter.length)];

		return interaction.reply({ content: `I'm choosing **${choose}**!` });
	}

};
