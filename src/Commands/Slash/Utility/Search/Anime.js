import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { Colors } from '../../../../Utils/Constants.js';
import { nanoid } from 'nanoid';
import Kitsu from 'kitsu';
import moment from 'moment';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'anime'],
			description: 'Search for an Anime on Kitsu.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);
		await interaction.deferReply();

		const kitsu = new Kitsu();

		const response = await kitsu.get('anime', { params: { filter: { text: search } } }).then(({ data }) => data);
		if (!response.length) return interaction.editReply({ content: 'Nothing found for this search.' });

		const selectId = `select-${nanoid()}`;
		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select an anime!')
				.addOptions(...response.map(data => ({
					value: data.id,
					label: this.client.utils.truncateString(data.titles.en_jp || Object.values(data.titles).filter(item => item?.length)[0], 95) || 'Unknown Name',
					...data.description?.length && { description: this.client.utils.truncateString(data.description, 95) }
				}))));

		const reply = await interaction.editReply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

		collector.on('collect', async (i) => {
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
				.setTitle(data.titles.en_jp || Object.values(data.titles).filter(item => item?.length)[0])
				.setThumbnail(data.posterImage?.original)
				.addFields({ name: '__Detail__', value: [
					`***English:*** ${data.titles.en ? data.titles.en : '`N/A`'}`,
					`***Japanese:*** ${data.titles.ja_jp ? data.titles.ja_jp : '`N/A`'}`,
					`***Synonyms:*** ${data.abbreviatedTitles.length ? data.abbreviatedTitles.join(', ') : '`N/A`'}`,
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

			return i.update({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('ignore', (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate();
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

}
