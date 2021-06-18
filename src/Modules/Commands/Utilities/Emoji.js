const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
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

		const emoji = message.guild.emojis.cache.find((emj) => emj.name === emote || emj.id === regex);
		if (!emoji) return message.quote('Please provide a custom emoji!');

		const authorFetch = await emoji.fetchAuthor();
		const checkOrCross = (bool) => bool ? 'Yes' : 'No';

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(`Emoji information on ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setTitle(emoji.name.toLowerCase())
			.setURL(emoji.url)
			.setThumbnail(emoji.url)
			.setDescription([
				`***ID:*** \`${emoji.id}\``,
				`***Author:*** ${authorFetch.tag} (\`${authorFetch.id}\`)`,
				`***Created:*** ${moment(emoji.createdTimestamp).format('MMMM D, YYYY HH:mm')} (${moment(emoji.createdTimestamp).fromNow()})`,
				`***Accessible:*** ${emoji.roles.cache.map((role) => role.name).join(', ') || 'Everyone'}`
			].join('\n'))
			.addField('\u200B', [
				`***Deletable:*** ${checkOrCross(emoji.deletable)}`,
				`***Animated:*** ${checkOrCross(emoji.animated)}`,
				`***Managed:*** ${checkOrCross(emoji.managed)}`
			].join('\n'))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		return message.channel.send({ embeds: [embed] });
	}

};
