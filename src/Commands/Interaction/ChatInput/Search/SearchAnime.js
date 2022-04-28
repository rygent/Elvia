const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const { nanoid } = require('nanoid');
const Kitsu = require('kitsu');
const api = new Kitsu();
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'anime',
			description: 'Search for an Anime on Kitsu.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);
		await interaction.deferReply({ fetchReply: true });

		const { data } = await api.get('anime', { params: { filter: { text: search } } });
		if (data.length === 0) return interaction.editReply({ content: 'Nothing found for this search.' });

		const selectId = `select-${nanoid()}`;
		const select = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
				.setCustomId(selectId)
				.setPlaceholder('Select an anime!')
				.addOptions(data.map(res => ({
					label: this.client.utils.truncateString(res.titles.en_jp || Object.values(res.titles)[0], 95) || 'Unknown Name',
					description: this.client.utils.truncateString(res.description, 95),
					value: res.slug
				}))));

		return interaction.editReply({ content: `I found **${data.length}** possible matches, please select one of the following:`, components: [select] }).then(message => {
			const filter = (i) => i.customId === selectId;
			const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				const [choices] = i.values;
				const result = data.find(x => x.slug === choices);

				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open in Browser')
						.setURL(`https://kitsu.io/anime/${result.slug}`));

				const embed = new MessageEmbed()
					.setColor(Colors.Default)
					.setAuthor({ name: 'Kitsu', iconURL: 'https://i.imgur.com/YlUX5JD.png', url: 'https://kitsu.io' })
					.setTitle(result.titles.en_jp || Object.values(result.titles)[0])
					.setThumbnail(result.posterImage?.original)
					.addField('__Detail__', [
						`***English:*** ${result.titles.en ? result.titles.en : '`N/A`'}`,
						`***Japanese:*** ${result.titles.ja_jp ? result.titles.ja_jp : '`N/A`'}`,
						`***Synonyms:*** ${result.abbreviatedTitles.length > 0 ? result.abbreviatedTitles.join(', ') : '`N/A`'}`,
						`***Score:*** ${result.averageRating ? result.averageRating : '`N/A`'}`,
						`***Rating:*** ${result.ageRating ? result.ageRating : '`N/A`'}${result.ageRatingGuide ? ` - ${result.ageRatingGuide}` : ''}`,
						`***Type:*** ${result.showType ? !['ONA', 'OVA', 'TV'].includes(result.showType) ? result.showType.toSentenceCase() : result.showType : '`N/A`'}`,
						`***Episodes:*** ${result.episodeCount ? result.episodeCount : '`N/A`'}`,
						`***Length:*** ${result.episodeLength ? `${result.episodeLength} minutes` : '`N/A`'}`,
						`***Status:*** ${result.status ? result.status === 'tba' ? result.status.toUpperCase() : result.status.toSentenceCase() : '`N/A`'}`,
						`***Aired:*** ${result.startDate ? `${result.showType === 'movie' ? moment(result.startDate).format('MMM D, YYYY') : `${moment(result.startDate).format('MMM D, YYYY')} to ${result.endDate ? moment(result.endDate).format('MMM D, YYYY') : '?'}`}` : '`N/A`'}`
					].join('\n'))
					.setImage(result.coverImage?.small)
					.setFooter({ text: 'Powered by Kitsu', iconURL: interaction.user.avatarURL({ dynamic: true }) });

				if (result.synopsis) {
					embed.setDescription(this.client.utils.truncateString(result.synopsis, 512));
				}

				return i.editReply({ content: '\u200B', embeds: [embed], components: [button] });
			});

			collector.on('end', (collected, reason) => {
				if ((collected.size === 0 || collected.filter(x => x.user.id === interaction.user.id).size === 0) && reason === 'time') {
					return interaction.deleteReply();
				}
			});
		});
	}

};
