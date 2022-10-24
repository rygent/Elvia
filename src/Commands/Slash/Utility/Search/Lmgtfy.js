import Command from '../../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'lmgtfy'],
			description: 'Let Me Google That For You.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		return interaction.reply({ content: `<https://letmegooglethat.com/?q=${encodeURIComponent(search)}>` });
	}

}
