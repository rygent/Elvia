const Slash = require('../Structures/Slash.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../Utils/Configuration.js');
const { getInfoFromName } = require('mal-scraper');

module.exports = class extends Slash {

	constructor(...args) {
		super(...args, {
			description: 'Gets anime information from MAL',
			options: [{
				type: 'STRING',
				name: 'query',
				description: 'Search for information Anime',
				required: true
			}]
		});
	}

	async run(interaction) {
		const query = interaction.options.getString('query', true);

		try {
			await interaction.defer();

			const data = await getInfoFromName(query.trim(), false);

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle('LINK')
					.setLabel('Trailer')
					.setURL(data.trailer));

			const embed = new MessageEmbed()
				.setColor(Color.MAL)
				.setAuthor('MyAnimeList', 'https://i.imgur.com/QABhOrL.png', 'https://myanimelist.net/')
				.setTitle(data.title)
				.setURL(data.url)
				.setThumbnail(data.picture)
				.setDescription(data.synopsis)
				.addField('__Detail__', [
					`***English:*** ${data.englishTitle ? data.englishTitle : data.title}`,
					`***Synonyms:*** ${data.synonyms[0] ? data.synonyms.join(', ').toString() : '`N/A`'}`,
					`***Japanese:*** ${data.japaneseTitle}`,
					`***Score:*** ${data.score ? data.score : '`N/A`'} (${data.scoreStats ? data.scoreStats : '`N/A`'})`,
					`***Genres:*** ${data.genres[0] ? data.genres.join(', ').toString() : '`N/A`'}`,
					`***Rating:*** ${data.rating ? data.rating : '`N/A`'}`,
					`***Source:*** ${data.source}`,
					`***Type:*** ${data.type ? data.type : '`N/A`'}`,
					`***Premiered:*** ${data.premiered ? data.premiered : '`N/A`'}`,
					`***Broadcast:*** ${data.broadcast}`,
					`***Episodes:*** ${data.episodes ? data.episodes : '`N/A`'}`,
					`***Duration:*** ${data.duration ? data.duration : '`N/A`'}`,
					`***Status:*** ${data.status}`,
					`***Aired:*** ${data.aired}`
				].join('\n'))
				.addField('\u200B', [
					`***Characters:*** ${data.characters[0] ? data.characters.map((get) => `${get.name} (${get.role})`).join(', ') : '`N/A`'}`,
					`***Producers:*** ${data.producers[0] ? data.producers.join(', ').toString() : '`N/A`'}`,
					`***Studios:*** ${data.studios[0] ? data.studios.join(', ').toString() : '`N/A`'}`,
					`***Ranked:*** ${data.ranked ? data.ranked : '`N/A`'}`,
					`***Popularity:*** ${data.popularity ? data.popularity : '`N/A`'}`,
					`***Members:*** ${data.members ? data.members : '`N/A`'}`,
					`***Favorites:*** ${data.favorites ? data.favorites : '`N/A`'}`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(interaction)} | Powered by MyAnimeList`, interaction.user.avatarURL({ dynamic: true }));

			return interaction.editReply({ embeds: [embed], components: [button] });
		} catch {
			return interaction.editReply({ content: 'No result found!' });
		}
	}

};
