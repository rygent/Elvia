const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ig', 'insta'],
			description: 'Find out some nice instagram statistics',
			category: 'searches',
			usage: '<username>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 5000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [username]) {
		if (!username) return message.channel.send('Maybe it\'s useful to actually search for someone...!');

		const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
		axios.get(`https://apis.duncte123.me/insta/${username}`, { headers }).then(res => {
			const account = res.data.user;

			const embed = new MessageEmbed()
				.setColor(Colors.INSTAGRAM)
				.setAuthor('Instagram Search Engine', 'https://i.imgur.com/wgMjJvq.png', 'https://instagram.com/')
				.setTitle(account.full_name)
				.setURL(`https://instagram.com/${account.username}`)
				.setThumbnail(account.profile_pic_url)
				.setDescription(`${account.biography.length === 0 ? 'No Biography' : account.biography}`)
				.addField('__Details__', stripIndents`
					***Username:*** @${account.username}
					***Posts:*** ${account.uploads.count.formatNumber()}
					***Followers:*** ${account.followers.count.formatNumber()}
					***Following:*** ${account.following.count.formatNumber()}
					***Verified:*** ${account.is_verified ? 'Yes' : 'No'}
					***Private:*** ${account.is_private ? 'Yes' : 'No'}`)
				.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Instagram`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		}).catch(() => {
			message.channel.send('I couldn\'t find that account...');
		});
	}

};
