const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'instagram',
			description: 'Search for user on Instagram.'
		});
	}

	async run(interaction) {
		const username = await interaction.options.getString('username', true);

		try {
			const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
			const result = await axios.get(`https://instagram.com/${username}/feed/?__a=1`, { headers }).then(res => res.data);

			const account = result.graphql.user;

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://instagram.com/${account.username}`));

			const embed = new MessageEmbed()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Instagram', iconURL: 'https://i.imgur.com/wgMjJvq.png', url: 'https://instagram.com/' })
				.setTitle(account.full_name)
				.setThumbnail(account.profile_pic_url_hd)
				.setDescription(`${account.biography.length === 0 ? 'No Biography' : account.biography}`)
				.addField('__Detail__', [
					`***Username:*** @${account.username}${account.is_verified ? '✅' : ''}${account.is_private ? '🔒' : ''}`,
					`***Posts:*** ${account.edge_owner_to_timeline_media.count.toLocaleString()}`,
					`***Followers:*** ${account.edge_followed_by.count.toLocaleString()}`,
					`***Following:*** ${account.edge_follow.count.toLocaleString()}`
				].join('\n'))
				.setFooter({ text: `Powered by Instagram`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

			return interaction.reply({ embeds: [embed], components: [button] });
		} catch (error) {
			if (error.response.status === 404) {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
