import Command from '../../../Structures/Interaction.js';
import { time } from 'discord.js';
import { Duration } from '@sapphire/time-utilities';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['timeout'],
			description: 'Timeout a member with duration and optional reason.',
			memberPermissions: ['ModerateMembers'],
			clientPermissions: ['ModerateMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('member', true);
		const duration = interaction.options.getString('duration', true);
		const reason = interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.user.id === interaction.user.id) return interaction.reply({ content: `You can't timeout yourself.`, ephemeral: true });
		if (member.user.id === this.client.user.id) return interaction.reply({ content: `You cannot timeout me!`, ephemeral: true });
		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot timeout a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.moderatable) return interaction.reply({ content: `I cannot timeout a member who has a higher or equal role than mine.`, ephemeral: true });

		let parseDuration = new Duration(duration).offset;
		if (parseDuration > 24192e5) return interaction.reply({ content: 'The duration is too long. The maximum duration is 28 days.', ephemeral: true });
		else if (parseDuration > 241884e4 && parseDuration <= 24192e5) parseDuration = 241884e4;

		await member.timeout(parseDuration, `${reason ? `${reason} (Timed out by ${interaction.user.tag})` : `(Timed out by ${interaction.user.tag})`}`);

		return interaction.reply({ content: [
			`**${member.user.tag}** was timed out!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`,
			`\n***Expiration:*** ${time(new Date(Date.now() + parsedDuration), 'R')}`
		].join('') });
	}

}
