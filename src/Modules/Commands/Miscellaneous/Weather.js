const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Colors } = require('../../../Structures/Configuration.js');
const weather = require('openweather-apis');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['forecast'],
			description: 'Shows weather information at a specific location.',
			category: 'Miscellaneous',
			usage: '[location]',
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */ /* eslint-disable complexity */
	async run(message, args) {
		const location = args.join(' ').trim();
		if (!location) {
			return message.quote('Please enter a city name to search!');
		}

		weather.setAPPID(Access.OPENWEATHER);
		weather.setLang('en');
		weather.setUnits('metric');
		weather.setCity(location.toLowerCase());
		weather.getAllWeather((err, res) => {
			if (err) {
				return message.quote('An API error occurred, Please try again later!');
			}

			if (res.cod === '404' || !res.sys.country) {
				return message.quote('Couldn\'t find that location!');
			} else if (res.cod === '401') {
				return message.quote('Invalid API Key!');
			}

			let compass;
			if (res.wind.deg > 39.37 && res.wind.deg < 84.37) {
				compass = 'Northeast';
			} else if (res.wind.deg > 84.37 && res.wind.deg < 129.37) {
				compass = 'East';
			} else if (res.wind.deg > 129.37 && res.wind.deg < 174.37) {
				compass = 'Southeast';
			} else if (res.wind.deg > 174.37 && res.wind.deg < 219.37) {
				compass = 'South';
			} else if (res.wind.deg > 219.37 && res.wind.deg < 264.37) {
				compass = 'Southwest';
			} else if (res.wind.deg > 264.37 && res.wind.deg < 309.37) {
				compass = 'West';
			} else if (res.wind.deg > 309.37 && res.wind.deg < 354.37) {
				compass = 'Northwest';
			} else {
				compass = 'North';
			}

			/* eslint-disable no-mixed-operators */
			const embed = new MessageEmbed()
				.setColor(Colors.OPENWEATHER)
				.setAuthor('OpenWeatherMap Search Engine', 'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg', 'https://openweathermap.org/')
				.setTitle(`:flag_${res.sys.country.toLowerCase()}: ${res.name} - ${res.weather[0].main}`)
				.setURL(`https://openweathermap.org/city/${res.id}`)
				.setThumbnail(`https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`)
				.setDescription([
					`${res.weather[0].description[0].toUpperCase()}${res.weather[0].description.slice(1)} (${res.clouds.all}% clouds)\n`,
					`***Temperature:*** ${res.main.temp}°C | ${(res.main.temp * 1.8 + 32).toFixed(2)}°F`,
					`***Feels Like:*** ${res.main.feels_like}°C | ${(res.main.feels_like * 1.8 + 32).toFixed(2)}°F`,
					`***Humidity:*** ${res.main.humidity}%`,
					`***Minimum Temperature:*** ${res.main.temp_min}°C | ${(res.main.temp_min * 1.8 + 32).toFixed(2)}°F`,
					`***Maximum Temperature:*** ${res.main.temp_max}°C | ${(res.main.temp_max * 1.8 + 32).toFixed(2)}°F`,
					`***Pressure:*** ${res.main.pressure} hPA`,
					`***Wind Speed:*** ${(res.wind.speed * 3.6).toFixed(2)} km/h | ${(res.wind.speed * 2.2369).toFixed(2)} mph, ${compass} (${res.wind.deg}°)`
				].join('\n'))
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by OpenWeatherMap`, message.author.avatarURL({ dynamic: true }));

			return message.channel.send({ embeds: [embed] });
		});
	}

};
