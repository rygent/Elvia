const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { ButtonStyle, ComponentType } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const { nanoid } = require('nanoid');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'steam',
			description: 'Search for a Games on Steam.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
		const response = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${search}&l=en&cc=us`, { headers }).then(res => res.data);

		const result = response.items.filter(x => x.type === 'app');
		if (result.length === 0) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = `select-${nanoid()}`;
		const select = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
				.setCustomId(selectId)
				.setPlaceholder('Select a game!')
				.addOptions(result.map(res => ({
					label: res.name,
					value: res.id.toString()
				}))));

		return interaction.reply({ content: `I found **${result.length}** possible matches, please select one of the following:`, components: [select], fetchReply: true }).then(message => {
			const filter = (i) => i.customId === selectId;
			const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				const [ids] = i.values;
				const data = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${ids}&l=en&cc=us`, { headers }).then(res => res.data[ids].data);

				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open in Browser')
						.setURL(`https://store.steampowered.com/app/${data.steam_appid}/`));

				const embed = new MessageEmbed()
					.setColor(Colors.Default)
					.setAuthor({ name: 'Steam', iconURL: 'https://i.imgur.com/xxr2UBZ.png', url: 'http://store.steampowered.com/' })
					.setTitle(data.name)
					.setDescription(data.short_description)
					.addField('__Detail__', [
						`***Release Date:*** ${data.release_date.coming_soon ? 'Coming soon' : data.release_date.date}`,
						`***Price:*** \`${data.price_overview ? data.price_overview.final_formatted : 'Free'}\``,
						`***Genres:*** ${data.genres.map(x => x.description).join(', ')}`,
						`***Platform:*** ${data.platforms ? this.client.utils.formatArray(Object.keys(data.platforms).filter(x => data.platforms[x])).toProperCase().replace(/And/g, 'and') : '`N/A`'}`,
						`***Metascores:*** ${data.metacritic ? `${data.metacritic.score} from [metacritic](${data.metacritic.url})` : '`N/A`'}`,
						`***Developers:*** ${data.developers.join(', ')}`,
						`***Publishers:*** ${data.publishers.join(', ')}`,
						`${data.content_descriptors?.notes ? `\n*${data.content_descriptors.notes.replace(/\r|\n/g, '')}*` : ''}`
					].join('\n'))
					.setImage(data.header_image)
					.setFooter({ text: 'Powered by Steam', iconURL: interaction.user.avatarURL({ dynamic: true }) });

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
