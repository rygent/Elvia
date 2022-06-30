import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['roulette'],
			description: 'Get a random winner from the roulette.'
		});
	}

	async run(interaction) {
		const title = interaction.options.getString('title', true);

		const member = await interaction.guild.members.cache.filter(({ user }) => !user.bot).random();

		return interaction.reply({ content: `🥇 Winner of **${title}** is ${member.user.tag}.` });
	}

}
