const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
	name: 'softban',
	description: "Softban a user. (Bans and unbans to clear up the user's messages.)",
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to softban.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the softban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}, {
		name: 'days',
		description: 'Number of days to delete messages for. (0-7)',
		type: ApplicationCommandOptionType.Integer,
		min_value: 0,
		max_value: 7,
		required: false
	}],
	default_member_permissions: PermissionFlagsBits.BanMembers.toString(),
	dm_permission: false
};
