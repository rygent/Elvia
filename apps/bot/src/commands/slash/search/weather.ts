import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	ContainerBuilder,
	SectionBuilder,
	SeparatorBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder
} from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { sentenceCase } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'weather',
			description: 'Search for weather forecast.',
			options: [
				{
					name: 'location',
					description: 'Your location.',
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
		const location = interaction.options.getString('location', true);

		const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
		const response = await axios
			.get(`${endpoint}?q=${encodeURIComponent(location)}&appid=${env.OPEN_WEATHER_API_KEY}&units=metric`)
			.then(({ data }) => data)
			.catch(({ status }) => {
				if (status === 401) {
					return interaction.reply({ content: 'Invalid API key.', flags: MessageFlags.Ephemeral });
				}
				if (status === 404) {
					return interaction.reply({ content: 'Nothing found for this search.', flags: MessageFlags.Ephemeral });
				}
			});

		const container = new ContainerBuilder()
			.addSectionComponents(
				new SectionBuilder()
					.addTextDisplayComponents(
						new TextDisplayBuilder().setContent(
							[
								heading(
									hyperlink(
										`:flag_${response.sys.country.toLowerCase()}: ${response.name} - ${response.weather[0].main}`,
										`https://openweathermap.org/city/${response.id}`
									),
									2
								),
								`${sentenceCase(response.weather[0].description)} (${response.clouds.all}% clouds)`
							].join('\n')
						)
					)
					.setThumbnailAccessory(
						new ThumbnailBuilder().setURL(`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
					)
			)
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${bold('Temperature:')} ${response.main.temp}°C | ${(response.main.temp * 1.8 + 32).toFixed(2)}°F`,
						`${bold('Feels Like:')} ${response.main.feels_like}°C | ${(response.main.feels_like * 1.8 + 32).toFixed(
							2
						)}°F`,
						`${bold('Humidity:')} ${response.main.humidity}%`,
						`${bold('Min. Temp:')} ${response.main.temp_min}°C | ${(response.main.temp_min * 1.8 + 32).toFixed(2)}°F`,
						`${bold('Max. Temp:')} ${response.main.temp_max}°C | ${(response.main.temp_max * 1.8 + 32).toFixed(2)}°F`,
						`${bold('Pressure:')} ${response.main.pressure} hPA`,
						`${bold('Wind Speed:')} ${(response.wind.speed * 3.6).toFixed(2)} km/h | ${(
							response.wind.speed * 2.2369
						).toFixed(2)} mph, ${response.wind.deg}°`
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('OpenWeather')}`)));

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
