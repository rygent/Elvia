import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, italic } from '@discordjs/formatters';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { sentenceCase } from '@/lib/utils/Functions.js';
import { Env } from '@/lib/Env.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'weather',
			description: 'Search for weather forecast.',
			options: [
				{
					name: 'search',
					description: 'Your search.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const search = interaction.options.getString('search', true);

		const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
		const raw = await request(
			`${endpoint}?q=${encodeURIComponent(search)}&appid=${Env.OpenWeatherApiKey}&units=metric`,
			{
				method: 'GET',
				headers: { 'User-Agent': UserAgent },
				maxRedirections: 20
			}
		);

		if (raw.statusCode === 401) return interaction.reply({ content: 'Invalid API key.', ephemeral: true });
		if (raw.statusCode === 404) {
			return interaction.reply({ content: 'Nothing found for this search.', ephemeral: true });
		}
		const response: any = await raw.body.json();

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(`https://openweathermap.org/city/${response.id}`)
		);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({
				name: 'Open Weather',
				iconURL: 'https://i.imgur.com/OgkS8BG.jpg',
				url: 'https://openweathermap.org/'
			})
			.setTitle(`:flag_${response.sys.country.toLowerCase()}: ${response.name} - ${response.weather[0].main}`)
			.setThumbnail(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
			.setDescription(
				[
					`${sentenceCase(response.weather[0].description)} (${response.clouds.all}% clouds)\n`,
					`${bold(italic('Temperature:'))} ${response.main.temp}°C | ${(response.main.temp * 1.8 + 32).toFixed(2)}°F`,
					`${bold(italic('Feels Like:'))} ${response.main.feels_like}°C | ${(
						response.main.feels_like * 1.8 +
						32
					).toFixed(2)}°F`,
					`${bold(italic('Humidity:'))} ${response.main.humidity}%`,
					`${bold(italic('Min. Temp:'))} ${response.main.temp_min}°C | ${(response.main.temp_min * 1.8 + 32).toFixed(
						2
					)}°F`,
					`${bold(italic('Max. Temp:'))} ${response.main.temp_max}°C | ${(response.main.temp_max * 1.8 + 32).toFixed(
						2
					)}°F`,
					`${bold(italic('Pressure:'))} ${response.main.pressure} hPA`,
					`${bold(italic('Wind Speed:'))} ${(response.wind.speed * 3.6).toFixed(2)} km/h | ${(
						response.wind.speed * 2.2369
					).toFixed(2)} mph, ${response.wind.deg}°`
				].join('\n')
			)
			.setFooter({ text: `Powered by Open Weather`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
