const InteractionCommand = require('../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors, Emojis } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'instagram'],
			description: 'Search for user on Instagram.'
		});
	}

	async run(interaction) {
		const username = await interaction.options.getString('username', true);

		try {
			const response = await axios.get(`https://instagram.com/${username}/feed/?__a=1`).then(({ data }) => data.graphql.user);

			const button = new ActionRowBuilder()
				.addComponents([new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://instagram.com/${response.username}`)]);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Instagram', iconURL: 'https://i.imgur.com/wgMjJvq.png', url: 'https://instagram.com/' })
				.setTitle(response.full_name)
				.setThumbnail(response.profile_pic_url_hd)
				.setDescription(`${response.biography.length === 0 ? 'No Biography' : response.biography}`)
				.addFields([{ name: '__Detail__', value: [
					`***Username:*** @${response.username}${response.is_verified ? ` ${Emojis.Verified}` : ''}${response.is_private ? ' 🔒' : ''}`,
					`***Posts:*** ${response.edge_owner_to_timeline_media.count.formatNumber()}`,
					`***Followers:*** ${response.edge_followed_by.count.formatNumber()}`,
					`***Following:*** ${response.edge_follow.count.formatNumber()}`
				].join('\n'), inline: false }])
				.setFooter({ text: `Powered by Instagram`, iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed], components: [button] });
		} catch (error) {
			if (error.response.status === 404) {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
