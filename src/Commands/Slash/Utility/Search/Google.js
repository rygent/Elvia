import Command from '../../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'google'],
			description: 'Search for something on Google.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		return interaction.reply({ content: `<https://www.google.com/search?q=${encodeURIComponent(search)}>` });
	}

}
