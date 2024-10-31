import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	DiscordToken: z.string(),
	DiscordApplicationId: z.string().min(17).max(20),
	DeveloperGuildId: z.string().min(17).max(20),
	ClientOwners: z.string().min(17).max(20).array(),
	DatabaseUrl: z.string().url(),

	ClientApiAuth: z.string().optional(),
	ClientApiPort: z.string().optional(),

	CustomStatus: z.string().nullable(),
	DebugMode: z.boolean(),
	UnsafeMode: z.boolean(),
	SupportServerUrl: z.string().url(),
	LoggerWebhookUrl: z.string().url(),
	GuildWebhookUrl: z.string().url(),

	ImgurClientId: z.string(),
	OpenWeatherApiKey: z.string(),
	SpotifyClientId: z.string(),
	SpotifyClientSecret: z.string(),
	TmdbApiKey: z.string()
});

export const env = schema.parse({
	DiscordToken: process.env.DISCORD_TOKEN,
	DiscordApplicationId: process.env.DISCORD_APPLICATION_ID,
	DeveloperGuildId: process.env.DEVELOPER_GUILD_ID,
	ClientOwners: process.env.CLIENT_OWNERS?.split(',').filter((item) => item.length),
	DatabaseUrl: process.env.DATABASE_URL,

	ClientApiAuth: process.env.CLIENT_API_AUTH,
	ClientApiPort: process.env.CLIENT_API_PORT ?? process.env.PORT,

	CustomStatus: process.env.CUSTOM_STATUS?.length ? process.env.CUSTOM_STATUS : null,
	DebugMode: process.env.DEBUG_MODE === 'true',
	UnsafeMode: process.env.UNSAFE_MODE === 'true',
	SupportServerUrl: process.env.SUPPORT_SERVER_URL,
	LoggerWebhookUrl: process.env.LOGGER_WEBHOOK_URL,
	GuildWebhookUrl: process.env.GUILD_WEBHOOK_URL,

	ImgurClientId: process.env.IMGUR_CLIENT_ID,
	OpenWeatherApiKey: process.env.OPEN_WEATHER_API_KEY,
	SpotifyClientId: process.env.SPOTIFY_CLIENT_ID,
	SpotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	TmdbApiKey: process.env.TMDB_API_KEY
});
