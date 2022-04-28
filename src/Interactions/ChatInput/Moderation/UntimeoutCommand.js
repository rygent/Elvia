const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
	name: 'untimeout',
	description: 'Remove timeout from a member.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to remove timeout from.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the timeout removal.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: PermissionFlagsBits.ModerateMembers.toString(),
	dm_permission: false
};
