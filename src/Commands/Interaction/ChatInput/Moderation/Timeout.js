const Interaction = require('../../../../Structures/Interaction');
const { Formatters } = require('discord.js');
const ms = require('ms');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'timeout',
			description: 'Timeout a member with duration and optional reason.',
			memberPermissions: ['MODERATE_MEMBERS'],
			clientPermissions: ['MODERATE_MEMBERS']
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('member', true);
		const duration = await interaction.options.getString('duration', true);
		const reason = await interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.user.id === interaction.user.id) return interaction.reply({ content: `You can't timeout yourself.`, ephemeral: true });
		if (member.user.id === this.client.user.id) return interaction.reply({ content: `You cannot timeout me!`, ephemeral: true });
		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot timeout a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.moderatable) return interaction.reply({ content: `I cannot timeout a member who has a higher or equal role than mine.`, ephemeral: true });

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		var parsedDuration = ms(duration);
		if (parsedDuration > 2419200000) return interaction.reply({ content: 'The duration is too long. The maximum duration is 28 days.', ephemeral: true });
		if (parsedDuration > 2418840000 && parsedDuration <= 2419200000) parsedDuration = 2418840000;

		await member.timeout(parsedDuration, `${reason ? `${reason} (Timed out by ${interaction.user.tag})` : `(Timed out by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		return interaction.reply({ content: [
			`**${member.user.tag}** was timed out!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`,
			`\n***Expiration:*** ${Formatters.time(new Date(Date.now() + parsedDuration), 'R')}`
		].join('') });
	}

};
