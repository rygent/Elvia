const Command = require('../../Structures/Command.js');
const { Formatters, MessageEmbed } = require('discord.js');
const { Color, Emoji } = require('../../Utils/Setting.js');
const moment = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Show custom emoji information on server.',
			category: 'Utilities',
			usage: '[customEmoji]',
			cooldown: 3000
		});
	}

	async run(message, [emote]) {
		const regex = emote.replace(/^<a?:\w+:(\d+)>$/, '$1');

		const emoji = message.guild.emojis.cache.find(x => x.name === emote || x.id === regex);
		if (!emoji) return message.reply({ content: 'Please provide a custom emoji!' });

		const authorFetch = await emoji.fetchAuthor();
		const checkOrCross = (bool) => bool ? Emoji.CHECK : Emoji.CROSS;

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Emoji information on ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setTitle(emoji.name.toLowerCase())
			.setURL(emoji.url)
			.setThumbnail(emoji.url)
			.setDescription([
				`***ID:*** \`${emoji.id}\``,
				`***Author:*** ${authorFetch}`,
				`***Created:*** ${Formatters.time(new Date(emoji.createdTimestamp))} (${moment(emoji.createdTimestamp).fromNow()})`,
				`***Accessible:*** ${emoji.roles.cache.map(role => role.name).join(', ') || 'Everyone'}\n`,
				`***Deletable:*** ${checkOrCross(emoji.deletable)}`,
				`***Animated:*** ${checkOrCross(emoji.animated)}`,
				`***Managed:*** ${checkOrCross(emoji.managed)}`
			].join('\n'))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		return message.reply({ embeds: [embed] });
	}

};
