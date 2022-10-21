import Event from '../../Structures/Event.js';
import { isRestrictedChannel } from '../../Structures/Util.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'interactionCreate',
			once: false
		});
	}

	async run(interaction) {
		if (!interaction.isAutocomplete()) return;

		if (interaction.commandName === 'nsfw') {
			const category = interaction.options.getFocused();
			if (!isRestrictedChannel(interaction.channel)) return interaction.respond([]);

			const data = require('../../Assets/json/nsfw.json');
			const choices = data.filter(choice => choice.value.includes(category));

			if (category.length) {
				return interaction.respond(choices.map(({ name, value }) => ({ name, value })));
			} else {
				return interaction.respond(choices.filter(({ hoisted }) => hoisted).map(({ name, value }) => ({ name, value })));
			}
		}
	}

}
