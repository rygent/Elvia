import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['choose'],
			description: 'Let me make a choice for you.'
		});
	}

	async run(interaction) {
		const requiredChoice = ['1st', '2nd'].map(name => interaction.options.getString(name, true));
		const optionalChoice = ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
			.map(name => interaction.options.getString(name));

		const choice = [...requiredChoice, ...optionalChoice];
		const filter = choice.filter(item => item !== null);
		const choose = choice[Math.floor(Math.random() * filter.length)];

		return interaction.reply({ content: `I'm choosing **${choose}**!` });
	}

}
