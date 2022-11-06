import Command from '../../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v10';
import { Colors, Credentials } from '../../../../Utils/Constants.js';
import { sentenceCase } from '../../../../Structures/Util.js';
import { fetch } from 'undici';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['search', 'weather'],
			description: 'Search for weather forecast.'
		});
	}

	async run(interaction) {
		const search = interaction.options.getString('search', true);

		const API_URI = 'https://api.openweathermap.org/data/2.5/weather';
		const raw = await fetch(`${API_URI}?q=${encodeURIComponent(search)}&appid=${Credentials.OpenWeatherApiKey}&units=metric`, { method: 'GET' });
		if (raw.status === 401) return interaction.reply({ content: 'Invalid API key.', ephemeral: true });
		if (raw.status === 404) return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });

		const response = await raw.json();

		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`https://openweathermap.org/city/${response.id}`));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: 'Open Weather', iconURL: 'https://i.imgur.com/OgkS8BG.jpg', url: 'https://openweathermap.org/' })
			.setTitle(`:flag_${response.sys.country.toLowerCase()}: ${response.name} - ${response.weather[0].main}`)
			.setThumbnail(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
			.setDescription([
				`${sentenceCase(response.weather[0].description)} (${response.clouds.all}% clouds)\n`,
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
	}

}
