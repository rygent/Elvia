export { Colors, Emojis } from './Enums.js';

export const Credentials = {
	GeniusApiKey: process.env.GENIUS_API_KEY as string,
	ImgurClientId: process.env.IMGUR_CLIENT_ID as string,
	OpenWeatherApiKey: process.env.OPEN_WEATHER_API_KEY as string,
	SpotifyClientId: process.env.SPOTIFY_CLIENT_ID as string,
	SpotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
	TmdbApiKey: process.env.TMDB_API_KEY as string
} as const;

export const Links = {
	SupportServer: process.env.SUPPORT_SERVER_URL as string,
	LoggerWebhook: process.env.LOGGER_WEBHOOK_URL as string,
	GuildWebhook: process.env.GUILD_WEBHOOK_URL as string
} as const;
