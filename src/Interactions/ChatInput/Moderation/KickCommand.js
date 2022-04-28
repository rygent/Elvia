const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
	name: 'kick',
	description: 'Kick a member with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'member',
		description: 'Member to kick.',
		type: ApplicationCommandOptionType.User,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the kick.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: PermissionFlagsBits.KickMembers.toString(),
	dm_permission: false
};
