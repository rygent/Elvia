const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'kick',
			description: 'Kick a member with optional reason.',
			memberPermissions: ['KICK_MEMBERS'],
			clientPermissions: ['KICK_MEMBERS']
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('member', true);
		const reason = await interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.user.id === interaction.user.id) return interaction.reply({ content: `You can't kick yourself.`, ephemeral: true });
		if (member.user.id === this.client.user.id) return interaction.reply({ content: `You cannot kick me!`, ephemeral: true });
		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot kick a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.kickable) return interaction.reply({ content: `I cannot kick a member who has a higher or equal role than mine.`, ephemeral: true });

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		await interaction.guild.members.kick(member, `${reason ? `${reason} (Kicked by ${interaction.user.tag})` : `(Kicked by ${interaction.user.tag})`}`);

		guildData.casesCount++;
		await guildData.save();

		return interaction.reply({ content: [
			`**${member.user.tag}** was kicked!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });
	}

};
