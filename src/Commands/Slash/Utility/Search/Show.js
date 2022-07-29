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
			name: ['search', 'show'],
			description: 'Search for a TV Show on TMDb.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		const raw = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${Credentials.TmdbApiKey}&query=${search}`, { method: 'GET' });
		const response = await raw.json().then(({ results }) => results.slice(0, 10));
		if (!response.length) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = `select-${nanoid()}`;
		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a TV shows!')
				.addOptions(...response.map(data => ({
					value: data.id.toString(),
					label: `${data.name} ${data.first_air_date ? `(${new Date(data.first_air_date).getFullYear()})` : ''}`,
					...data.overview && { description: cutText(data.overview, 100) }
				}))));

		const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, max: 1, time: 60_000 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			const [ids] = i.values;
			const data = await fetch(`https://api.themoviedb.org/3/tv/${ids}?api_key=${Credentials.TmdbApiKey}`, { method: 'GET' })
				.then(res => res.json());

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://www.themoviedb.org/tv/${data.id}`));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'The Movie Database', iconURL: 'https://i.imgur.com/F9tD6x9.png', url: 'https://www.themoviedb.org' })
				.setTitle(data.name)
				.setDescription(data.overview ? cutText(data.overview, 512) : null)
				.setThumbnail(`https://image.tmdb.org/t/p/original${data.poster_path}`)
				.addFields({ name: '__Detail__', value: [
					`***Genre:*** ${formatArray(data.genres.map(({ name }) => name.replace(/ &/, ',')))}`,
					...data.vote_average ? [`***Rating:*** ${data.vote_average.toFixed(2)} (by ${data.vote_count.formatNumber()} users)`] : [],
					`***Status:*** ${data.status}`,
					...data.first_air_date ? [`***Aired:*** ${this.getDate(data.first_air_date, data.last_air_date)}`] : [],
					...data.episode_run_time?.length ? [`***Runtime:*** ${this.getRuntime(data.episode_run_time[0])}`] : [],
					...data.number_of_seasons ? [`***Total seasons:*** ${data.number_of_seasons}`] : [],
					...data.number_of_episodes ? [`***Total episodes:*** ${data.number_of_episodes}`] : [],
					...data.production_companies?.length ? [`***Studio:*** ${formatArray(data.production_companies.map(({ name }) => name))}`] : [],
					...data.networks?.length ? [`***Networks:*** ${formatArray(data.networks.map(({ name }) => name))}`] : []
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

	getDate(startDate, endDate) {
		if (startDate && !endDate) return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ?`;
		else return `${moment(new Date(startDate)).format('MMM D, YYYY')} to ${moment(new Date(endDate)).format('MMM D, YYYY')}`;
	}

}
