import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['untimeout'],
			description: 'Remove timeout from a member.',
			memberPermissions: ['ModerateMembers'],
			clientPermissions: ['ModerateMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('member', true);
		const reason = interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot remove a timeout from a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.moderatable) return interaction.reply({ content: `I cannot remove a timeout from a member who has a higher or equal role than mine.`, ephemeral: true });

		await member.timeout(null, `${reason ? `${reason} (Time out removed by ${interaction.user.tag})` : `(Time out removed by ${interaction.user.tag})`}`);

		return interaction.reply({ content: [
			`**${member.user.tag}** is no longer timed out!`,
			...reason ? [`***Reason:*** ${reason}`] : []
		].join('\n') });
	}

}
