const Interaction = require('../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Api, Color } = require('../../../../Utils/Configuration.js');
const weather = require('openweather-apis');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'search',
			subCommand: 'weather',
			description: 'Search for a Weather forecast.'
		});
	}

	async run(interaction) {
		const location = await interaction.options.getString('location', true);

		weather.setAPPID(Api.OpenWeatherMap);
		weather.setLang('en');
		weather.setUnits('metric');
		weather.setCity(location.toLowerCase());
		weather.getAllWeather(async (error, result) => {
			if (error) return await interaction.reply({ content: 'An API error occurred, Please try again later!', ephemeral: true });

			if (result.cod === '404' || !result.sys.country) {
				return await interaction.reply({ content: 'Couldn\'t find that location!', ephemeral: true });
			} else if (result.cod === '401') {
				return await interaction.reply({ content: 'Invalid API Key!', ephemeral: true });
			}

			let compass;
			if (result.wind.deg > 39.37 && result.wind.deg < 84.37) {
				compass = 'Northeast';
			} else if (result.wind.deg > 84.37 && result.wind.deg < 129.37) {
				compass = 'East';
			} else if (result.wind.deg > 129.37 && result.wind.deg < 174.37) {
				compass = 'Southeast';
			} else if (result.wind.deg > 174.37 && result.wind.deg < 219.37) {
				compass = 'South';
			} else if (result.wind.deg > 219.37 && result.wind.deg < 264.37) {
				compass = 'Southwest';
			} else if (result.wind.deg > 264.37 && result.wind.deg < 309.37) {
				compass = 'West';
			} else if (result.wind.deg > 309.37 && result.wind.deg < 354.37) {
				compass = 'Northwest';
			} else {
				compass = 'North';
			}

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle('LINK')
					.setLabel('Open in Browser')
					.setURL(`https://openweathermap.org/city/${result.id}`));

			/* eslint-disable no-mixed-operators */
			const embed = new MessageEmbed()
				.setColor(Color.DEFAULT)
				.setAuthor({ name: 'Open Weather Map', iconURL: 'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg', url: 'https://openweathermap.org/' })
				.setTitle(`:flag_${result.sys.country.toLowerCase()}: ${result.name} - ${result.weather[0].main}`)
				.setThumbnail(`https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`)
				.setDescription([
					`${result.weather[0].description[0].toUpperCase()}${result.weather[0].description.slice(1)} (${result.clouds.all}% clouds)\n`,
					`***Temperature:*** ${result.main.temp}°C | ${(result.main.temp * 1.8 + 32).toFixed(2)}°F`,
					`***Feels Like:*** ${result.main.feels_like}°C | ${(result.main.feels_like * 1.8 + 32).toFixed(2)}°F`,
					`***Humidity:*** ${result.main.humidity}%`,
					`***Min. Temperature:*** ${result.main.temp_min}°C | ${(result.main.temp_min * 1.8 + 32).toFixed(2)}°F`,
					`***Max. Temperature:*** ${result.main.temp_max}°C | ${(result.main.temp_max * 1.8 + 32).toFixed(2)}°F`,
					`***Pressure:*** ${result.main.pressure} hPA`,
					`***Wind Speed:*** ${(result.wind.speed * 3.6).toFixed(2)} km/h | ${(result.wind.speed * 2.2369).toFixed(2)} mph, ${compass} (${result.wind.deg}°)`
				].join('\n'))
				.setFooter({ text: `Powered by OpenWeatherMap`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

			return await interaction.reply({ embeds: [embed], components: [button] });
		});
	}

};
