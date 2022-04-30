const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'unban',
	description: 'Unban a user with optional reason.',
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'user',
		description: 'User to unban. (Username or User ID)',
		type: ApplicationCommandOptionType.String,
		required: true
	}, {
		name: 'reason',
		description: 'Reason of the unban.',
		type: ApplicationCommandOptionType.String,
		required: false
	}],
	default_member_permissions: new PermissionsBitField(['BanMembers']).bitfield.toString(),
	dm_permission: false
};
