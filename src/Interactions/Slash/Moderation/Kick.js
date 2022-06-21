const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');
const { PermissionsBitField } = require('discord.js');

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
	default_member_permissions: new PermissionsBitField(['KickMembers']).bitfield.toString(),
	dm_permission: false
};
