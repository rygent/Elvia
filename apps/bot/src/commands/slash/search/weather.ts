import { CoreCommand, type CoreClient } from '@elvia/core';
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
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, heading, hyperlink, subtext } from '@discordjs/formatters';
import { sentenceCase } from '@/lib/utils/functions.js';
import { UndiciError, fetcher } from '@/lib/fetcher.js';
import { env } from '@/env.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
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
			integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const location = interaction.options.getString('location', true);

		const params = new URLSearchParams();
		params.append('q', location);
		params.append('appid', env.OPEN_WEATHER_API_KEY);
		params.append('units', 'metric');

		try {
			const respond = await fetcher(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`, {
				method: 'GET'
			});

			const container = new ContainerBuilder()
				.addSectionComponents(
					new SectionBuilder()
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								[
									heading(
										hyperlink(
											`:flag_${respond.sys.country.toLowerCase()}: ${respond.name} - ${respond.weather[0].main}`,
											`https://openweathermap.org/city/${respond.id}`
										),
										2
									),
									`${sentenceCase(respond.weather[0].description)} (${respond.clouds.all}% clouds)`
								].join('\n')
							)
						)
						.setThumbnailAccessory(
							new ThumbnailBuilder().setURL(`https://openweathermap.org/img/wn/${respond.weather[0].icon}@2x.png`)
						)
				)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						[
							`${bold('Temperature:')} ${respond.main.temp}°C | ${(respond.main.temp * 1.8 + 32).toFixed(2)}°F`,
							`${bold('Feels Like:')} ${respond.main.feels_like}°C | ${(respond.main.feels_like * 1.8 + 32).toFixed(2)}°F`,
							`${bold('Humidity:')} ${respond.main.humidity}%`,
							`${bold('Min. Temp:')} ${respond.main.temp_min}°C | ${(respond.main.temp_min * 1.8 + 32).toFixed(2)}°F`,
							`${bold('Max. Temp:')} ${respond.main.temp_max}°C | ${(respond.main.temp_max * 1.8 + 32).toFixed(2)}°F`,
							`${bold('Pressure:')} ${respond.main.pressure} hPA`,
							`${bold('Wind Speed:')} ${(respond.wind.speed * 3.6).toFixed(2)} km/h | ${(
								respond.wind.speed * 2.2369
							).toFixed(2)} mph, ${respond.wind.deg}°`
						].join('\n')
					)
				)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext(`Powered by ${bold('OpenWeather')}`)));

			return await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
		} catch (error) {
			if (error instanceof UndiciError) {
				if (error.statusCode === 404) {
					return interaction.reply({ content: 'Nothing found for this location.', flags: MessageFlags.Ephemeral });
				}
			}

			throw error;
		}
	}
}
