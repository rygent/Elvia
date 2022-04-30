const InteractionCommand = require('../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Formatters } = require('discord.js');
const { Colors, Secrets } = require('../../../../Utils/Constants');
const { nanoid } = require('nanoid');
const imdb = require('imdb-api');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'imdb'],
			description: 'Search for something on IMDb.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const response = await imdb.search({ name: search }, { apiKey: Secrets.ImdbApiKey }, 1).then(({ results }) => results);

			const menuId = `menu-${nanoid()}`;
			const menu = new ActionRowBuilder()
				.addComponents([new SelectMenuBuilder()
					.setCustomId(menuId)
					.setPlaceholder('Select a movies/series!')
					.addOptions(response.map(data => ({
						label: `${data.title} (${data.year})`,
						value: data.imdbid,
						description: data.type.toSentenceCase()
					})))]);

			const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [menu] });

			const filter = (i) => i.customId === menuId;
			const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				const [ids] = i.values;
				const data = await imdb.get({ id: ids }, { apiKey: Secrets.ImdbApiKey });

				const rating = data.ratings.find(item => item.source === 'Internet Movie Database');
				const tomatometer = data.ratings.find(item => item.source === 'Rotten Tomatoes');
				const metascore = data.ratings.find(item => item.source === 'Metacritic');

				const button = new ActionRowBuilder()
					.addComponents([new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open in Browser')
						.setURL(data.imdburl)]);

				const embed = new EmbedBuilder()
					.setColor(Colors.Default)
					.setAuthor({ name: 'IMDb', iconURL: 'https://i.imgur.com/0BTAjjv.png', url: 'https://www.imdb.com/' })
					.setTitle(`${data.title} (${data.series ? data.year === 0 ? data.start_year : data.year : data.year})`)
					.setThumbnail(data.poster)
					.setDescription(data.plot)
					.addFields([{ name: '__Detail__', value: [
						`***Genre:*** ${data.genres ? data.genres : '`N/A`'}\n`,
						`***Rating:*** ${rating ? `${rating.value}${data.votes ? ` (by ${data.votes} users)` : ''}` : '`N/A`'}\n`,
						`***Tomatometer:*** ${tomatometer ? `${tomatometer.value} from [Rotten Tomatoes](https://rottentomatoes.com/)` : '`N/A`'}\n`,
						`***Metascores:*** ${metascore ? `${metascore.value} from [Metacritic](https://metacritic.com/)` : '`N/A`'}\n`,
						`***Released:*** ${data.released ? Formatters.time(new Date(data.released), 'D') : '`N/A`'}\n`,
						`***Rated:*** ${data.rated ? data.rated : '`N/A`'}\n`,
						`***Type:*** ${data.type ? data.type.toTitleCase() : '`N/A`'}\n`,
						`***Runtime:*** ${data.runtime !== 'N/A' ? data.runtime : '`N/A`'}\n`,
						`${data.series ? `***Total Seasons:*** ${data.totalseasons ? data.totalseasons : '`N/A`'}\n` : ''}`,
						`***Director:*** ${data.director !== 'N/A' ? data.director : '`N/A`'}\n`,
						`***Cast:*** ${data.actors !== 'N/A' ? data.actors : '`N/A`'}`,
						`${data.awards !== 'N/A' ? `\n***Awards:*** ${data.awards}` : ''}`
					].join(''), inline: false }])
					.setFooter({ text: 'Powered by IMDb', iconURL: interaction.user.avatarURL() });

				return i.editReply({ content: null, embeds: [embed], components: [button] });
			});

			collector.on('end', (collected, reason) => {
				if ((!collected.size || !collected.filter(({ user }) => user.id === interaction.user.id).size) && reason === 'time') {
					return interaction.deleteReply();
				}
			});
		} catch (error) {
			if (error.name === 'imdb api error') {
				return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
