import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { DurationFormatter } from '@sapphire/time-utilities';
import { Colors, Credentials } from '../../../../Utils/Constants.js';
import { cutText, formatArray } from '../../../../Structures/Util.js';
import { nanoid } from 'nanoid';
import { fetch } from 'undici';
import moment from 'moment';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'movie'],
			description: 'Search for a Movie on TMDb.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		const raw = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${Credentials.TmdbApiKey}&query=${search}`, { method: 'GET' });
		const response = await raw.json().then(({ results }) => results.slice(0, 10));
		if (!response.length) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = `select-${nanoid()}`;
		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a movies!')
				.addOptions(...response.map(data => ({
					value: data.id.toString(),
					label: `${data.title} ${data.release_date ? `(${new Date(data.release_date).getFullYear()})` : ''}`,
					...data.overview && { description: cutText(data.overview, 100) }
				}))));

		const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, max: 1, time: 60_000 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			const [ids] = i.values;
			const data = await fetch(`https://api.themoviedb.org/3/movie/${ids}?api_key=${Credentials.TmdbApiKey}`, { method: 'GET' })
				.then(res => res.json());

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://www.themoviedb.org/movie/${data.id}`));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'The Movie Database', iconURL: 'https://i.imgur.com/F9tD6x9.png', url: 'https://www.themoviedb.org' })
				.setTitle(data.title)
				.setDescription(data.overview ? cutText(data.overview, 512) : null)
				.setThumbnail(`https://image.tmdb.org/t/p/original${data.poster_path}`)
				.addFields({ name: '__Detail__', value: [
					`***Genre:*** ${formatArray(data.genres.map(({ name }) => name))}`,
					...data.vote_average ? [`***Rating:*** ${data.vote_average.toFixed(2)} (by ${data.vote_count.formatNumber()} users)`] : [],
					`***Status:*** ${data.status}`,
					...data.release_date ? [`***Released:*** ${moment(new Date(data.release_date)).format('MMM D, YYYY')}`] : [],
					...data.runtime ? [`***Runtime:*** ${this.getRuntime(data.runtime)}`] : [],
					...data.production_companies?.length ? [`***Studio:*** ${formatArray(data.production_companies.map(({ name }) => name))}`] : [],
					...data.belongs_to_collection ? [`***Collection:*** ${data.belongs_to_collection.name}`] : [],
					...data.imdb_id ? [`***IMDb:*** [Click here](http://www.imdb.com/title/${data.imdb_id})`] : []
				].join('\n'), inline: false })
				.setImage(`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
				.setFooter({ text: 'Powered by The Movie Database', iconURL: interaction.user.avatarURL() });

			return i.update({ content: null, embeds: [embed], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if (!collected.size && reason === 'time') return interaction.deleteReply();
		});
	}

	getRuntime(runtime) {
		const formatter = (milliseconds) => new DurationFormatter().format(milliseconds, undefined, { right: ', ' });
		return `${formatter(runtime * 6e4)}`;
	}

}
