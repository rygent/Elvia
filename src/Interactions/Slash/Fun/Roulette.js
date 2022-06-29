import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'roulette',
	description: 'Get a random winner from the roulette.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'title',
		description: 'The title of the winner.',
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	dm_permission: false
};
