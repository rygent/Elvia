import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { time } from 'discord.js';
import imdb from 'imdb-api';
import { nanoid } from 'nanoid';
import Command from '../../../../Structures/Interaction.js';
import { Colors, Credentials } from '../../../../Utils/Constants.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'imdb'],
			description: 'Search for something on IMDb.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		try {
			const response = await imdb.search({ name: search }, { apiKey: Credentials.ImdbApiKey }, 1).then(({ results }) => results);

			const selectId = `select-${nanoid()}`;
			const select = new ActionRowBuilder()
				.addComponents(new SelectMenuBuilder()
					.setCustomId(selectId)
					.setPlaceholder('Select a movies/series!')
					.addOptions(...response.map(data => ({
						value: data.imdbid,
						label: `${data.title} (${data.year})`,
						description: data.type.toSentenceCase()
					}))));

			const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

			const filter = (i) => i.user.id === interaction.user.id;
			const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

			collector.on('collect', async (i) => {
				const [ids] = i.values;
				const data = await imdb.get({ id: ids }, { apiKey: Credentials.ImdbApiKey });

				const rating = data.ratings.find(item => item.source === 'Internet Movie Database');
				const tomatometer = data.ratings.find(item => item.source === 'Rotten Tomatoes');
				const metascore = data.ratings.find(item => item.source === 'Metacritic');

				const button = new ActionRowBuilder()
					.addComponents(new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open in Browser')
						.setURL(data.imdburl));

				const embed = new EmbedBuilder()
					.setColor(Colors.Default)
					.setAuthor({ name: 'IMDb', iconURL: 'https://i.imgur.com/0BTAjjv.png', url: 'https://www.imdb.com/' })
					.setTitle(`${data.title} (${data.series ? data.year === 0 ? data.start_year : data.year : data.year})`)
					.setThumbnail(data.poster)
					.setDescription(data.plot)
					.addFields({ name: '__Detail__', value: [
						`***Genre:*** ${data.genres ? data.genres : '`N/A`'}`,
						`***Rating:*** ${rating ? `${rating.value}${data.votes ? ` (by ${data.votes} users)` : ''}` : '`N/A`'}`,
						`***Tomatometer:*** ${tomatometer ? `${tomatometer.value} from [Rotten Tomatoes](https://rottentomatoes.com/)` : '`N/A`'}`,
						`***Metascores:*** ${metascore ? `${metascore.value} from [Metacritic](https://metacritic.com/)` : '`N/A`'}`,
						`***Released:*** ${data.released ? time(new Date(data.released), 'D') : '`N/A`'}`,
						`***Rated:*** ${data.rated ? data.rated : '`N/A`'}`,
						`***Type:*** ${data.type ? data.type.toTitleCase() : '`N/A`'}`,
						`***Runtime:*** ${data.runtime !== 'N/A' ? data.runtime : '`N/A`'}`,
						...data.series ? [`***Total Seasons:*** ${data.totalseasons ? data.totalseasons : '`N/A`'}`] : [],
						`***Director:*** ${data.director !== 'N/A' ? data.director : '`N/A`'}`,
						`***Cast:*** ${data.actors !== 'N/A' ? data.actors : '`N/A`'}`,
						...data.awards !== 'N/A' ? [`***Awards:*** ${data.awards}`] : []
					].join('\n'), inline: false })
					.setFooter({ text: 'Powered by IMDb', iconURL: interaction.user.avatarURL() });

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
		} catch (error) {
			if (error.name === 'imdb api error') {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

}
