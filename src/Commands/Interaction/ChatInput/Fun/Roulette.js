const Interaction = require('../../../../Structures/Interaction');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'roulette',
			description: 'Get a random winner from the roulette.'
		});
	}

	async run(interaction) {
		const title = await interaction.options.getString('title', true);

		const member = await interaction.guild.members.cache.filter(m => !m.user.bot).random();

		return interaction.reply({ content: `🥇 Winner of **${title}** is ${member.user.tag}.` });
	}

};
