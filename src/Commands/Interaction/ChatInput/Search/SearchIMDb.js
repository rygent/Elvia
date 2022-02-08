const Interaction = require('../../../../Structures/Interaction.js');
const { Formatters, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { Api, Color } = require('../../../../Settings/Configuration.js');
const IMDb = require('imdb-api');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'imdb',
			description: 'Search for something on IMDb.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const result = await IMDb.search({ name: search }, { apiKey: Api.Imdb }, 1).then(res => res.results);

			const select = new MessageActionRow()
				.addComponents(new MessageSelectMenu()
					.setCustomId('data_menu')
					.setPlaceholder('Select a movies/series!')
					.addOptions(result.map(res => ({
						label: `${res.title} (${res.year})`,
						description: res.type.toProperCase(),
						value: res.imdbid
					}))));

			return interaction.reply({ content: `I found **${result.length}** possible matches, please select one of the following:`, components: [select], fetchReply: true }).then(message => {
				const collector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60_000 });

				collector.on('collect', async (i) => {
					if (i.user.id !== interaction.user.id) return i.deferUpdate();
					await i.deferUpdate();

					const [ids] = i.values;
					const data = await IMDb.get({ id: ids }, { apiKey: Api.Imdb });

					const rating = data.ratings.find(x => x.source === 'Internet Movie Database');
					const tomatometer = data.ratings.find(x => x.source === 'Rotten Tomatoes');
					const metascore = data.ratings.find(x => x.source === 'Metacritic');

					const button = new MessageActionRow()
						.addComponents(new MessageButton()
							.setStyle('LINK')
							.setLabel('Open in Browser')
							.setURL(data.imdburl));

					const embed = new MessageEmbed()
						.setColor(Color.DEFAULT)
						.setAuthor({ name: 'IMDb', iconURL: 'https://i.imgur.com/0BTAjjv.png', url: 'https://www.imdb.com/' })
						.setTitle(`${data.title} (${data.series ? data.year === 0 ? data.start_year : data.year : data.year})`)
						.setThumbnail(data.poster)
						.setDescription(data.plot)
						.addField('__Detail__', [
							`***Genre:*** ${data.genres ? data.genres : '`N/A`'}\n`,
							`***Rating:*** ${rating ? `${rating.value}${data.votes ? ` (by ${data.votes} users)` : ''}` : '`N/A`'}\n`,
							`***Tomatometer:*** ${tomatometer ? `${tomatometer.value} from [Rotten Tomatoes](https://rottentomatoes.com/)` : '`N/A`'}\n`,
							`***Metascores:*** ${metascore ? `${metascore.value} from [Metacritic](https://metacritic.com/)` : '`N/A`'}\n`,
							`***Released:*** ${data.released ? Formatters.time(new Date(data.released), 'D') : '`N/A`'}\n`,
							`***Rated:*** ${data.rated ? data.rated : '`N/A`'}\n`,
							`***Type:*** ${data.type ? data.type.toProperCase() : '`N/A`'}\n`,
							`***Runtime:*** ${data.runtime !== 'N/A' ? data.runtime : '`N/A`'}\n`,
							`${data.series ? `***Total Seasons:*** ${data.totalseasons ? data.totalseasons : '`N/A`'}\n` : ''}`,
							`***Director:*** ${data.director !== 'N/A' ? data.director : '`N/A`'}\n`,
							`***Cast:*** ${data.actors !== 'N/A' ? data.actors : '`N/A`'}`,
							`${data.awards !== 'N/A' ? `\n***Awards:*** ${data.awards}` : ''}`
						].join(''))
						.setFooter({ text: 'Powered by IMDb', iconURL: interaction.user.avatarURL({ dynamic: true }) });

					return i.editReply({ content: '\u200B', embeds: [embed], components: [button] });
				});

				collector.on('end', (collected, reason) => {
					if ((collected.size === 0 || collected.filter(x => x.user.id === interaction.user.id).size === 0) && reason === 'time') {
						return interaction.deleteReply();
					}
				});
			});
		} catch (error) {
			if (error.name === 'imdb api error') {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
