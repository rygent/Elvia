import { ApplicationCommandType, ApplicationCommandOptionType } from 'discord-api-types/v10';

export default {
	name: 'choose',
	description: 'Let me make a choice for you.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: '1st',
		description: '1st choice.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: '2nd',
		description: '2nd choice.',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: '3rd',
		description: '3rd choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '4th',
		description: '4th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '5th',
		description: '5th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '6th',
		description: '6th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '7th',
		description: '7th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '8th',
		description: '8th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '9th',
		description: '9th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: '10th',
		description: '10th choice.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	dm_permission: true
};
