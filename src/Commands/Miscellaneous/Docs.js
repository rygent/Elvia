const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['discordjs', 'djs'],
			description: 'Shows information from the discord.js documentation.',
			category: 'Miscellaneous',
			usage: '[searchQuery] (source)',
			cooldown: 3000
		});
	}

	async run(message, [query, source = 'stable']) {
		if (!query) return message.reply({ content: 'Please specify a valid query to search!' });

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${source}&q=${encodeURIComponent(query)}`, { headers }).then(res => res.data);

		if (!result || result.error) {
			return message.reply({ content: `\`${query}\` couldn't be located within the discord.js documentation (<https://discord.js.org/>).` });
		}

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setCustomId('delete')
				.setLabel('Delete'));

		const embed = new MessageEmbed(result)
			.setFooter(`${message.author.username}  •  Powered by Discord.JS`, message.author.avatarURL({ dynamic: true }));

		const m = await message.reply({ embeds: [embed], components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then(interaction => {
			if (interaction.customId === 'delete') {
				return m.delete();
			}
		}).catch(() => m.edit({ components: [] }));
	}

};
