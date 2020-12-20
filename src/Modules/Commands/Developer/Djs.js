const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['discordjs', 'docs'],
			description: 'Display information from the discord.js documentation.',
			category: 'Developer',
			usage: '<searchQuery>',
			clientPerms: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) return message.quote('Please input a provided query');

		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		const result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`, { headers }).then(res => res.data);

		if (!result || result.error) {
			return message.quote(`"${query}" couldn't be located within the discord.js documentation (<https://discord.js.org/>).`);
		}

		const embed = new MessageEmbed(result)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Discord.js`, message.author.avatarURL({ dynamic: true }));

		if (!message.guild) {
			return message.channel.send(embed);
		}

		const msg = await message.channel.send(embed);
		msg.react('🗑');

		let react;
		try {
			react = await msg.awaitReactions(
				(reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id,
				{ max: 1, time: 10000, errors: ['time'] }
			);
		} catch (error) {
			msg.reactions.removeAll();
		}

		if (react && react.first()) msg.delete();

		return message;
	}

};
