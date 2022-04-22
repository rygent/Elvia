const InteractionCommand = require('../../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors, Secrets } = require('../../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['search', 'weather'],
			description: 'Search for weather forecast.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		try {
			const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
			const response = await axios.get(`${endpoint}?q=${encodeURIComponent(search)}&appid=${Secrets.OpenWeatherApiKey}&units=metric`).then(({ data }) => data);

			const button = new ActionRowBuilder()
				.addComponents([new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://openweathermap.org/city/${response.id}`)]);

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Open Weather', iconURL: 'https://i.imgur.com/OgkS8BG.jpg', url: 'https://openweathermap.org/' })
				.setTitle(`:flag_${response.sys.country.toLowerCase()}: ${response.name} - ${response.weather[0].main}`)
				.setThumbnail(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
				.setDescription([
					`${response.weather[0].description.toSentenceCase()} (${response.clouds.all}% clouds)\n`,
					`***Temperature:*** ${response.main.temp}°C | ${((response.main.temp * 1.8) + 32).toFixed(2)}°F`,
					`***Feels Like:*** ${response.main.feels_like}°C | ${((response.main.feels_like * 1.8) + 32).toFixed(2)}°F`,
					`***Humidity:*** ${response.main.humidity}%`,
					`***Min. Temperature:*** ${response.main.temp_min}°C | ${((response.main.temp_min * 1.8) + 32).toFixed(2)}°F`,
					`***Max. Temperature:*** ${response.main.temp_max}°C | ${((response.main.temp_max * 1.8) + 32).toFixed(2)}°F`,
					`***Pressure:*** ${response.main.pressure} hPA`,
					`***Wind Speed:*** ${(response.wind.speed * 3.6).toFixed(2)} km/h | ${(response.wind.speed * 2.2369).toFixed(2)} mph, ${response.wind.deg}°`
				].join('\n'))
				.setFooter({ text: `Powered by Open Weather`, iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed], components: [button] });
		} catch (error) {
			switch (error.response.status) {
				case 401:
					return interaction.reply({ content: 'Invalid API key. Please [click here](http://openweathermap.org/faq#error401) for more information.', ephemeral: true });
				case 404:
					return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
			}
		}
	}

};
