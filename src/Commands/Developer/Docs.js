const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['discordjs', 'djs'],
			description: 'Shows information from the discord.js documentation.',
			category: 'Developer',
			usage: '[searchQuery]',
			clientPerms: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) return message.reply({ content: 'Please specify a valid query to search!' });

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`, { headers }).then(res => res.data);

		if (!result || result.error) {
			return message.reply({ content: `\`${query}\` couldn't be located within the discord.js documentation (<https://discord.js.org/>).` });
		}

		const embed = new MessageEmbed(result)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Discord.js`, message.author.avatarURL({ dynamic: true }));

		if (!message.guild) {
			return message.reply({ embeds: [embed] });
		}

		const msg = await message.reply({ embeds: [embed] });
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
