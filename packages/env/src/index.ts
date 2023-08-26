import { s } from '@sapphire/shapeshift';
import 'dotenv/config';

const schema = s.object({
	DiscordToken: s.string,
	DiscordApplicationId: s.string.lengthGreaterThanOrEqual(17),
	DiscordGuildId: s.string.lengthGreaterThanOrEqual(17),
	ClientPrefix: s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(4),
	ClientOwners: s.string.lengthGreaterThanOrEqual(17).array,
	ClientVersion: s.string.nullable,
	DatabaseUrl: s.string,

	DebugMode: s.boolean,
	Timezone: s.string,
	SupportServerUrl: s.string.url(),
	LoggerWebhookUrl: s.string.url(),
	GuildWebhookUrl: s.string.url(),

	ImgurClientId: s.string,
	OpenWeatherApiKey: s.string,
	SpotifyClientId: s.string,
	SpotifyClientSecret: s.string,
	TmdbApiKey: s.string
});

const data = {
	DiscordToken: process.env.DISCORD_TOKEN,
	DiscordApplicationId: process.env.DISCORD_APPLICATION_ID,
	DiscordGuildId: process.env.DISCORD_GUILD_ID,
	ClientPrefix: process.env.CLIENT_PREFIX,
	ClientOwners: process.env.CLIENT_OWNERS?.split(',').filter((item) => item.length),
	ClientVersion: process.env.CLIENT_VERSION?.length ? process.env.CLIENT_VERSION : null,
	DatabaseUrl: process.env.DATABASE_URL,

	DebugMode: process.env.DEBUG_MODE === 'true',
	Timezone: process.env.TIMEZONE,
	SupportServerUrl: process.env.SUPPORT_SERVER_URL,
	LoggerWebhookUrl: process.env.LOGGER_WEBHOOK_URL,
	GuildWebhookUrl: process.env.GUILD_WEBHOOK_URL,

	ImgurClientId: process.env.IMGUR_CLIENT_ID,
	OpenWeatherApiKey: process.env.OPEN_WEATHER_API_KEY,
	SpotifyClientId: process.env.SPOTIFY_CLIENT_ID,
	SpotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	TmdbApiKey: process.env.TMDB_API_KEY
};

export const Env = schema.parse(data);
