const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Colors } = require('../../../../../Utils/Constants');
const { nanoid } = require('nanoid');
const KitsuClient = require('kitsu');
const moment = require('moment');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'anime'],
			description: 'Search for an Anime on Kitsu.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);
		await interaction.deferReply();

		const kitsu = new KitsuClient();

		const response = await kitsu.get('anime', { params: { filter: { text: search } } }).then(({ data }) => data);
		if (!response.length) return interaction.editReply({ content: 'Nothing found for this search.' });

		const menuId = `menu-${nanoid()}`;
		const menu = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(menuId)
				.setPlaceholder('Select an anime!')
				.addOptions(...response.map(res => ({
					label: this.client.utils.truncateString(res.titles.en_jp || Object.values(res.titles)[0], 95) || 'Unknown Name',
					value: res.id,
					description: this.client.utils.truncateString(res.description, 95).padEnd(1)
				}))));

		const reply = await interaction.editReply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [menu] });

		const filter = (i) => i.customId === menuId;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60000 });

		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate();
			await i.deferUpdate();

			const [selected] = i.values;
			const data = response.find(item => item.id === selected);

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://kitsu.io/anime/${data.slug}`));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Kitsu', iconURL: 'https://i.imgur.com/YlUX5JD.png', url: 'https://kitsu.io' })
				.setTitle(data.titles.en_jp || Object.values(data.titles)[0])
				.setThumbnail(data.posterImage?.original)
				.addFields({ name: '__Detail__', value: [
					`***English:*** ${data.titles.en ? data.titles.en : '`N/A`'}`,
					`***Japanese:*** ${data.titles.ja_jp ? data.titles.ja_jp : '`N/A`'}`,
					`***Synonyms:*** ${data.abbreviatedTitles.length > 0 ? data.abbreviatedTitles.join(', ') : '`N/A`'}`,
					`***Score:*** ${data.averageRating ? data.averageRating : '`N/A`'}`,
					`***Rating:*** ${data.ageRating ? data.ageRating : '`N/A`'}${data.ageRatingGuide ? ` - ${data.ageRatingGuide}` : ''}`,
					`***Type:*** ${data.showType ? !['ONA', 'OVA', 'TV'].includes(data.showType) ? data.showType.toSentenceCase() : data.showType : '`N/A`'}`,
					`***Episodes:*** ${data.episodeCount ? data.episodeCount : '`N/A`'}`,
					`***Length:*** ${data.episodeLength ? `${data.episodeLength} minutes` : '`N/A`'}`,
					`***Status:*** ${data.status ? data.status === 'tba' ? data.status.toUpperCase() : data.status.toSentenceCase() : '`N/A`'}`,
					`***Aired:*** ${data.startDate ? `${data.showType === 'movie' ? moment(data.startDate).format('MMM D, YYYY') : `${moment(data.startDate).format('MMM D, YYYY')} to ${data.endDate ? moment(data.endDate).format('MMM D, YYYY') : '?'}`}` : '`N/A`'}`
				].join('\n'), inline: false })
				.setImage(data.coverImage?.small)
				.setFooter({ text: 'Powered by Kitsu', iconURL: interaction.user.avatarURL() });

			if (data.synopsis) {
				embed.setDescription(this.client.utils.truncateString(data.synopsis, 512));
			}

			return i.editReply({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if ((!collected.size || !collected.filter(({ user }) => user.id === interaction.user.id).size) && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

};
