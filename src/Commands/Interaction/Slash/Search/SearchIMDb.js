const Interaction = require('../../../../Structures/Interaction.js');
const { MessageEmbed } = require('discord.js');
const { Api, Color } = require('../../../../Settings/Configuration.js');
const IMDb = require('imdb-api');
const moment = require('moment');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'imdb',
			description: 'Search for a movie/series on IMDb.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const result = await IMDb.get({ name: search }, { apiKey: Api.Imdb });

			const embed = new MessageEmbed()
				.setColor(Color.DEFAULT)
				.setAuthor({ name: 'IMDb', iconURL: 'https://i.imgur.com/0BTAjjv.png', url: 'https://www.imdb.com/' })
				.setTitle(result.title)
				.setURL(result.imdburl)
				.setThumbnail(result.poster)
				.setDescription(result.plot)
				.setFooter({ text: 'Powered by IMDb', iconURL: interaction.user.avatarURL({ dynamic: true }) });

			if (result.series !== true) {
				embed.addField('__Details__', [
					`***Released:*** ${moment(result.released).format('MMMM DD, YYYY')}`,
					`***Ratings:*** ${result.rating} ⭐ (by ${result.votes} users)`,
					`***Metascores:*** ${result.metascore} from [metacritic](https://metacritic.com)`,
					`***Genres:*** ${result.genres}`,
					`***Rated:*** ${result.rated}`,
					`***Type:*** ${result.type.toProperCase()}`,
					`***Runtime:*** ${result.runtime}`,
					`***Directors:*** ${result.director}`,
					`***Cast:*** ${result.actors}`,
					`***Production:*** ${result.production || 'Unknown'}`,
					`***Country:*** ${result.country}`,
					`***Language:*** ${result.languages}`
				].join('\n'));
			} else {
				embed.addField('__Details__', [
					`***Released:*** ${moment(result.released).format('MMMM DD, YYYY')}`,
					`***Released Year:*** ${result._year_result}`,
					`***Ratings:*** ${result.rating} ⭐ (by ${result.votes} users)`,
					`***Genres:*** ${result.genres}`,
					`***Rated:*** ${result.rated}`,
					`***Type:*** ${result.type.toProperCase()}`,
					`***Runtime:*** ${result.runtime}`,
					`***Total Seasons:*** ${result.totalseasons}`,
					`***Directors:*** ${result.director}`,
					`***Cast:*** ${result.actors}`,
					`***Production:*** ${result.production || 'Unknown'}`,
					`***Country:*** ${result.country}`,
					`***Language:*** ${result.languages}`
				].join('\n'));
			}

			if (result.awards !== 'N/A') {
				embed.addField('__Awards__', result.awards, false);
			}

			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			if (error.message.startsWith('Movie not found!:')) {
				return interaction.reply({ content: 'Search not found, please make sure you have entered the title correctly!', ephemeral: true });
			}
		}
	}

};
