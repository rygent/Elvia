const Interaction = require('../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'docs',
			description: 'Showing information from discord.js.org docs',
			options: [{
				name: 'query',
				type: 'STRING',
				description: 'Input a search query here',
				required: true
			}, {
				name: 'source',
				type: 'STRING',
				description: 'Choose a branch source',
				required: false,
				choices: [{
					name: 'Stable',
					value: 'stable'
				}, {
					name: 'Master',
					value: 'master'
				}]
			}]
		});
	}

	async run(interaction, [query, source = 'stable']) {
		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const data = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${encodeURIComponent(query)}`, { headers }).then(res => res.data);

		if (!data || data.error) {
			return interaction.reply({ content: 'That was not found on the docs', ephemeral: true });
		}

		const embed = new MessageEmbed(data)
			.setAuthor(data.author.name, 'https://discord.js.org/favicon-32x32.png', data.author.url)
			.setColor('#5865F2')
			.setFooter(`Responded in ${this.client.utils.responseTime(interaction)} | Powered by Discord.js`, interaction.user.displayAvatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	}

};
