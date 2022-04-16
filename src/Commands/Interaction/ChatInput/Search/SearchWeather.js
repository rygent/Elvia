/* eslint-disable no-mixed-operators */
const InteractionCommand = require('../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors, Secrets } = require('../../../../Utils/Constants');
const weather = require('openweather-apis');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'weather',
			description: 'Search for weather forecast.'
		});
	}

	async run(interaction) {
		const search = await interaction.options.getString('search', true);

		weather.setAPPID(Secrets.OpenWeatherApiKey);
		weather.setLang('en');
		weather.setUnits('metric');
		weather.setCity(search.toLowerCase());
		weather.getAllWeather(async (error, response) => {
			if (error) return interaction.reply({ content: 'An API error occurred, Please try again later!', ephemeral: true });

			if (response.cod === '404' || !response.sys.country) {
				return interaction.reply({ content: 'Couldn\'t find that location!', ephemeral: true });
			} else if (response.cod === '401') {
				return interaction.reply({ content: 'Invalid API Key!', ephemeral: true });
			}

			let compass;
			if (response.wind.deg > 39.37 && response.wind.deg < 84.37) {
				compass = 'Northeast';
			} else if (response.wind.deg > 84.37 && response.wind.deg < 129.37) {
				compass = 'East';
			} else if (response.wind.deg > 129.37 && response.wind.deg < 174.37) {
				compass = 'Southeast';
			} else if (response.wind.deg > 174.37 && response.wind.deg < 219.37) {
				compass = 'South';
			} else if (response.wind.deg > 219.37 && response.wind.deg < 264.37) {
				compass = 'Southwest';
			} else if (response.wind.deg > 264.37 && response.wind.deg < 309.37) {
				compass = 'West';
			} else if (response.wind.deg > 309.37 && response.wind.deg < 354.37) {
				compass = 'Northwest';
			} else {
				compass = 'North';
			}

			const button = new ActionRowBuilder()
				.addComponents(new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Open in Browser')
					.setURL(`https://openweathermap.org/city/${response.id}`));

			const embed = new EmbedBuilder()
				.setColor(Colors.Default)
				.setAuthor({ name: 'Open Weather', iconURL: 'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg', url: 'https://openweathermap.org/' })
				.setTitle(`:flag_${response.sys.country.toLowerCase()}: ${response.name} - ${response.weather[0].main}`)
				.setThumbnail(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
				.setDescription([
					`${response.weather[0].description[0].toUpperCase()}${response.weather[0].description.slice(1)} (${response.clouds.all}% clouds)\n`,
					`***Temperature:*** ${response.main.temp}°C | ${(response.main.temp * 1.8 + 32).toFixed(2)}°F`,
					`***Feels Like:*** ${response.main.feels_like}°C | ${(response.main.feels_like * 1.8 + 32).toFixed(2)}°F`,
					`***Humidity:*** ${response.main.humidity}%`,
					`***Min. Temperature:*** ${response.main.temp_min}°C | ${(response.main.temp_min * 1.8 + 32).toFixed(2)}°F`,
					`***Max. Temperature:*** ${response.main.temp_max}°C | ${(response.main.temp_max * 1.8 + 32).toFixed(2)}°F`,
					`***Pressure:*** ${response.main.pressure} hPA`,
					`***Wind Speed:*** ${(response.wind.speed * 3.6).toFixed(2)} km/h | ${(response.wind.speed * 2.2369).toFixed(2)} mph, ${compass} (${response.wind.deg}°)`
				].join('\n'))
				.setFooter({ text: `Powered by Open Weather`, iconURL: interaction.user.avatarURL() });

			return interaction.reply({ embeds: [embed], components: [button] });
		});
	}

};
