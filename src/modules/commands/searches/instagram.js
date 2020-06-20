const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'instagram',
			aliases: ['ig', 'insta'],
			description: 'Find out some nice instagram statistics',
			category: 'searches',
			usage: '<username>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, [target]) {
		const getInfo = async () => {
			if (!target) {
				return message.channel.send('Maybe it\'s useful to actually search for someone...!');
			}
			const headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36' };
			const response = await axios.get(`https://instagram.com/${target}/?__a=1`, { headers })
				.catch(() => message.channel.send('I couldn\'t find that account...'));
			const info = response.data.graphql.user;
			return info;
		};

		const account = await getInfo();

		const embed = new MessageEmbed()
			.setColor(Colors.INSTAGRAM)
			.setAuthor('Instagram Search Engine', 'https://i.imgur.com/wgMjJvq.png', 'https://instagram.com/')
			.setTitle(account.full_name)
			.setURL(`https://instagram.com/${account.username}`)
			.setThumbnail(account.profile_pic_url_hd)
			.setDescription(stripIndents`
                ${account.biography.length === 0 ? 'No Biography' : account.biography}
                ${account.external_url || ''}`)
			.addField('__Details__', stripIndents`
                ***Username:*** @${account.username}
                ***Posts:*** ${account.edge_owner_to_timeline_media.count.formatNumber()}
                ***Followers:*** ${account.edge_followed_by.count.formatNumber()}
				***Following:*** ${account.edge_follow.count.formatNumber()}
				***Verified:*** ${account.is_verified ? 'Yes' : 'No'}
                ***Private:*** ${account.is_private ? 'Yes' : 'No'}`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)} | Powered by Instagram`, message.author.avatarURL({ dynamic: true }));

		message.channel.send(embed);
	}

};
