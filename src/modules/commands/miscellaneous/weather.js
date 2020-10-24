const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access } = require('../../../structures/Configuration.js');
const weather = require('openweather-apis');
const moment = require('moment-timezone');
const geotz = require('geo-tz');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'weather',
			aliases: ['forecast'],
			description: 'Displays weather information for the specified location.',
			category: 'miscellaneous',
			usage: '<location>',
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, [...location]) { /* eslint-disable complexity */ /* eslint-disable camelcase */
		if (!location) {
			message.channel.send('Please provide me a city to search up!');
			return;
		}

		weather.setAPPID(Access.OPENWEATHER);
		weather.setLang('en');
		weather.setUnits('metric');
		weather.setCity(location.join(' ').toLowerCase().trim());
		weather.getAllWeather((err, res) => {
			if (err) {
				message.channel.send('An Error Has occured, Try again later.');
				return;
			}

			if (res.cod === '404' || !res.sys.country) {
				message.channel.send('Couldn\'t Find That Location!');
				return;
			} else if (res.cod === '401') {
				message.channel.send('Invalid API Key!');
				return;
			}

			let tempColors;
			if (res.main.temp < 0) {
				tempColors = '#CCF3FF';
			} else if (res.main.temp < 5) {
				tempColors = '#BFF0FF';
			} else if (res.main.temp < 10) {
				tempColors = '#B4FF92';
			} else if (res.main.temp < 15) {
				tempColors = '#8CF974';
			} else if (res.main.temp < 20) {
				tempColors = '#ECFF7A';
			} else if (res.main.temp < 25) {
				tempColors = '#FFC97A';
			} else if (res.main.temp < 30) {
				tempColors = '#FF6E46';
			} else if (res.main.temp < 35) {
				tempColors = '#FF4B22';
			} else if (res.main.temp < 40) {
				tempColors = '#FF3C22';
			} else if (res.main.temp > 40) {
				tempColors = '#BD0000';
			} else {
				tempColors = '#74CDFF';
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

			const city_tz = geotz(res.coord.lat, res.coord.lon);

			const embed = new MessageEmbed() /* eslint-disable no-mixed-operators */
				.setColor(tempColors)
				.setAuthor('Forecast today', 'https://cdn1.iconfinder.com/data/icons/weather-429/64/weather_icons_color-06-512.png')
				.setTitle(`:flag_${res.sys.country.toLowerCase()}: ${res.name} - ${res.weather[0].main}`)
				.setDescription(`${res.weather[0].description[0].toUpperCase()}${res.weather[0].description.slice(1)} (${res.clouds.all}% clouds)`)
				.setURL(`https://openweathermap.org/city/${res.id}`)
				.setThumbnail(`https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`)
				.addField('🌡️ Temperature', `${res.main.temp}°C | ${(res.main.temp * 1.8 + 32).toFixed(2)}°F`, true)
				.addField('🍧 Feels Like', `${res.main.feels_like}°C | ${(res.main.feels_like * 1.8 + 32).toFixed(2)}°F`, true)
				.addField('💧 Humidity', `${res.main.humidity}%`, true) // eslint-disable-next-line max-len
				.addField('☀️ Minimum/Maximum Temperature', `${res.main.temp_min}°C | ${(res.main.temp_min * 1.8 + 32).toFixed(2)}°F / ${res.main.temp_max}°C | ${(res.main.temp_max * 1.8 + 32).toFixed(2)}°F`, false)
				.addField('☁️ Pressure', `${res.main.pressure} hPA`, true)
				.addField('📏 Latitude | Longitude', `${res.coord.lat} | ${res.coord.lon}`, true)
				.addField('🌬️ Wind Speed', `${(res.wind.speed * 3.6).toFixed(2)} km/h | ${(res.wind.speed * 2.2369).toFixed(2)} mph, ${compass} (${res.wind.deg}°) `, false)
				.addField('🌅 Sunrise', `${moment(res.sys.sunrise * 1000).tz(`${city_tz}`).format('HH:mm z')}`, true)
				.addField('🌇 Sunset', `${moment(res.sys.sunset * 1000).tz(`${city_tz}`).format('HH:mm z')}`, true)
				.addField('⌚ Current Time', `${moment().tz(`${city_tz}`).format('ddd, MMMM DD, YYYY HH:mm z')}`, false)
				.setFooter(`Responded in ${this.client.utils.responseTime(message)} | Powered by OpenWeatherMap`, message.author.avatarURL({ dynamic: true }));

			message.channel.send(embed);
		});
	}

};
