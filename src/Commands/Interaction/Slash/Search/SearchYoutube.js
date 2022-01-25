const Interaction = require('../../../../Structures/Interaction.js');
const { Formatters, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { Api, Color } = require('../../../../Settings/Configuration.js');
const YouTube = require('simple-youtube-api');
const api = new YouTube(Api.Youtube);

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'youtube',
			description: 'Search for a YouTube videos.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);
		await interaction.deferReply({ fetchReply: true });

		const data = await api.searchVideos(search, 25);
		if (data.length === 0) return interaction.editReply({ content: 'Nothing found for this search.' });

		const select = new MessageActionRow()
			.addComponents(new MessageSelectMenu()
				.setCustomId('data_menu')
				.setPlaceholder('Select a videos!')
				.addOptions(data.map(res => ({
					label: res.title,
					description: res.channel.title,
					value: res.id
				}))));

		return interaction.editReply({ content: `I found **${data.length}** possible matches, please select one of the following:`, components: [select] }).then(message => {
			const collector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60_000 });

			collector.on('collect', async (i) => {
				if (i.user.id !== interaction.user.id) return i.deferUpdate();
				await i.deferUpdate();

				const [choices] = i.values;
				const result = data.find(x => x.id === choices);

				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle('LINK')
						.setLabel('Open in Browser')
						.setURL(result.shortURL));

				const embed = new MessageEmbed()
					.setColor(Color.DEFAULT)
					.setAuthor({ name: 'YouTube', iconURL: 'https://i.imgur.com/lbS6Vil.png', url: 'https://youtube.com/' })
					.setTitle(result.title)
					.setDescription([
						`**${result.channel.title}**`,
						`${result.description}\n`,
						`***Published:*** ${Formatters.time(new Date(result.publishedAt))}`
					].join('\n'))
					.setImage(result.thumbnails.high.url)
					.setFooter({ text: 'Powered by YouTube', iconURL: interaction.user.avatarURL({ dynamic: true }) });

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
