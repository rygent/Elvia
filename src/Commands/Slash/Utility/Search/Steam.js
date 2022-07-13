import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { Colors } from '../../../../Utils/Constants.js';
import { formatArray } from '../../../../Structures/Util.js';
import { nanoid } from 'nanoid';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'steam'],
			description: 'Search for a Games on Steam.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		const raw = await fetch(`https://store.steampowered.com/api/storesearch/?term=${search}&l=en&cc=us`, { method: 'GET' });
		const response = await raw.json().then(({ items }) => items.filter(({ type }) => type === 'app'));
		if (!response.length) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const selectId = `select-${nanoid()}`;
		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId(selectId)
				.setPlaceholder('Select a game!')
				.addOptions(...response.map(data => ({
					value: data.id.toString(),
					label: data.name
				}))));

		const reply = await interaction.reply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

		collector.on('collect', async (i) => {
			const [ids] = i.values;
			const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${ids}&l=en&cc=us`, { method: 'GET' })
				.then(res => res.json().then(item => item[ids].data));

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://store.steampowered.com/app/${data.steam_appid}/`));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Steam', iconURL: 'https://i.imgur.com/xxr2UBZ.png', url: 'http://store.steampowered.com/' })
				.setTitle(data.name)
				.setDescription(data.short_description)
				.addFields({ name: '__Detail__', value: [
					`***Release Date:*** ${data.release_date.coming_soon ? 'Coming soon' : data.release_date.date}`,
					`***Price:*** \`${data.price_overview ? data.price_overview.final_formatted : 'Free'}\``,
					`***Genres:*** ${data.genres.map(({ description }) => description).join(', ')}`,
					`***Platform:*** ${data.platforms ? formatArray(Object.keys(data.platforms).filter(item => data.platforms[item])).toTitleCase().replace(/And/g, 'and') : '`N/A`'}`,
					`***Metascores:*** ${data.metacritic ? `${data.metacritic.score} from [metacritic](${data.metacritic.url})` : '`N/A`'}`,
					`***Developers:*** ${data.developers.join(', ')}`,
					`***Publishers:*** ${data.publishers.join(', ')}`,
					`${data.content_descriptors?.notes ? `\n*${data.content_descriptors.notes.replace(/\r|\n/g, '')}*` : ''}`
				].join('\n'), inline: false })
				.setImage(data.header_image)
				.setFooter({ text: 'Powered by Steam', iconURL: interaction.user.avatarURL() });

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
