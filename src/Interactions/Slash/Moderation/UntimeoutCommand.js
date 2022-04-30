const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord-api-types/v10');
const { PermissionsBitField } = require('discord.js');

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
	default_member_permissions: new PermissionsBitField(['ModerateMembers']).bitfield.toString(),
	dm_permission: false
};
