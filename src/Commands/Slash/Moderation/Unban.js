import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['unban'],
			description: 'Unban a user with optional reason.',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers']
		});
	}

	async run(interaction) {
		const user = await interaction.options.getString('user', true);
		const reason = await interaction.options.getString('reason');

		const banned = await interaction.guild.bans.fetch();

		const target = banned.find(x => x.user.id === user || x.user.tag === user)?.user;
		if (!target) return interaction.reply({ content: 'This user is not banned on this server.', ephemeral: true });

		await interaction.guild.members.unban(target, `${reason ? `${reason} (Unbanned by ${interaction.user.tag})` : `(Unbanned by ${interaction.user.tag})`}`);

		return interaction.reply({ content: [
			`**${target.tag}** was unbanned!`,
			`${reason ? `\n***Reason:*** ${reason}` : ''}`
		].join('') });
	}

}
