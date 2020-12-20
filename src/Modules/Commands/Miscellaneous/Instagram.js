const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ig', 'insta'],
			description: 'Find out some nice instagram statistics',
			category: 'Miscellaneous',
			usage: '<username>',
			disabled: true,
			cooldown: 5000
		});
	}

	async run(message, args) {
		const query = args.join(' ').trim();
		if (!query) {
			return message.quote('Maybe it\'s useful to actually search for someone...!');
		}

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
			const data = await axios.get(`https://instagram.com/${query}/?__a=1`, { headers }).then(res => res.data.graphql.user);

			const embed = new MessageEmbed()
				.setColor(Colors.INSTAGRAM)
				.setAuthor('Instagram Search Engine', 'https://i.imgur.com/wgMjJvq.png', 'https://instagram.com/')
				.setTitle(data.full_name)
				.setURL(`https://instagram.com/${data.username}`)
				.setThumbnail(data.profile_pic_url_hd)
				.setDescription(`${data.biography.length === 0 ? 'No Biography' : data.biography}`)
				.addField('__Details__', [
					`***Username:*** @${data.username}`,
					`***Posts:*** ${data.edge_owner_to_timeline_media.count.formatNumber()}`,
					`***Followers:*** ${data.edge_followed_by.count.formatNumber()}`,
					`***Following:*** ${data.edge_follow.count.formatNumber()}`,
					`***Verified:*** ${data.is_verified ? 'Yes' : 'No'}`,
					`***Private:*** ${data.is_private ? 'Yes' : 'No'}`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by Instagram`, message.author.avatarURL({ dynamic: true }));

			return message.channel.send(embed);
		} catch {
			return message.quote('I couldn\'t find that account...');
		}
	}

};
