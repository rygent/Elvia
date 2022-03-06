const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'ban',
			description: 'Ban a user with optional reason.',
			memberPermissions: ['BAN_MEMBERS'],
			clientPermissions: ['BAN_MEMBERS']
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user', true);
		const reason = await interaction.options.getString('reason');
		const days = await interaction.options.getInteger('days');

		if (user.id === interaction.user.id) return interaction.reply({ content: `You can't ban yourself.`, ephemeral: true });
		if (user.id === this.client.user.id) return interaction.reply({ content: `You cannot ban me!`, ephemeral: true });

		const member = interaction.guild.members.cache.get(user.id);
		if (member && member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot ban a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (member && !member.bannable) return interaction.reply({ content: `I cannot ban a member who has a higher or equal role than mine.`, ephemeral: true });

		const guildData = await this.client.findOrCreateGuild({ id: interaction.guildId });

		await interaction.guild.members.ban(user, { days, reason: `${reason ? `${reason} (Banned by ${interaction.user.tag})` : `(Banned by ${interaction.user.tag})`}` });

		guildData.casesCount++;
		await guildData.save();

		return interaction.reply({ content: [
			`**${user.tag}** was banned!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });
	}

};
