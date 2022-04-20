const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, ComponentType } = require('discord-api-types/v10');
const { Formatters } = require('discord.js');
const { Colors, Secrets } = require('../../../../../Utils/Constants');
const YouTube = require('simple-youtube-api');
const api = new YouTube(Secrets.YoutubeApiKey);

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'youtube'],
			description: 'Search for a YouTube videos.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);
		await interaction.deferReply();

		const response = await api.searchVideos(search, 25);
		if (!response.length) return interaction.editReply({ content: 'Nothing found for this search.' });

		const select = new ActionRowBuilder()
			.addComponents(new SelectMenuBuilder()
				.setCustomId('data_menu')
				.setPlaceholder('Select a videos!')
				.addOptions(...response.map(res => ({
					label: res.title,
					value: res.id,
					description: res.channel.title
				}))));

		const reply = await interaction.editReply({ content: `I found **${response.length}** possible matches, please select one of the following:`, components: [select], fetchReply: true });

		const filter = (i) => i.customId === 'data_menu';
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60000 });

		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id) return i.deferUpdate();
			await i.deferUpdate();

			const [selected] = i.values;
			const data = response.find(x => x.id === selected);

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(data.shortURL));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'YouTube', iconURL: 'https://i.imgur.com/lbS6Vil.png', url: 'https://youtube.com/' })
				.setTitle(data.title)
				.setDescription([
					`**${data.channel.title}**`,
					`${data.description}\n`,
					`***Published:*** ${Formatters.time(new Date(data.publishedAt))}`
				].join('\n'))
				.setImage(data.thumbnails.high.url)
				.setFooter({ text: 'Powered by YouTube', iconURL: interaction.user.avatarURL() });

			return i.editReply({ content: '\u200B', embeds: [embed], components: [button] });
		});

		collector.on('end', (collected, reason) => {
			if ((!collected.size || !collected.filter(({ user }) => user.id === interaction.user.id).size) && reason === 'time') {
				return interaction.deleteReply();
			}
		});
	}

};
