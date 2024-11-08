import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
	DISCORD_TOKEN: z.string(),
	DISCORD_APPLICATION_ID: z.string().min(17).max(20),
	DEVELOPER_GUILD_ID: z.string().min(17).max(20),
	CLIENT_OWNERS: z.string().min(17).max(20).array(),
	DATABASE_URL: z.string().url(),

	SERVER_AUTH: z.string().optional(),
	SERVER_PORT: z.number().optional(),

	CUSTOM_STATUS: z.string().optional(),
	DEBUG_MODE: z.boolean(),
	UNSAFE_MODE: z.boolean(),
	SUPPORT_SERVER_URL: z.string().url(),
	LOGGER_WEBHOOK_URL: z.string().url(),
	GUILD_WEBHOOK_URL: z.string().url(),

	IMGUR_CLIENT_ID: z.string(),
	OPEN_WEATHER_API_KEY: z.string(),
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	TMDB_API_KEY: z.string()
});

export const env = envSchema.parse({
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
	DEVELOPER_GUILD_ID: process.env.DEVELOPER_GUILD_ID,
	CLIENT_OWNERS: process.env.CLIENT_OWNERS?.split(',').filter((item) => item.length),
	DATABASE_URL: process.env.DATABASE_URL,

	SERVER_AUTH: process.env.SERVER_AUTH,
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	SERVER_PORT: Number(process.env.SERVER_PORT || process.env.PORT),

	CUSTOM_STATUS: process.env.CUSTOM_STATUS,
	DEBUG_MODE: process.env.DEBUG_MODE === 'true',
	UNSAFE_MODE: process.env.UNSAFE_MODE === 'true',
	SUPPORT_SERVER_URL: process.env.SUPPORT_SERVER_URL,
	LOGGER_WEBHOOK_URL: process.env.LOGGER_WEBHOOK_URL,
	GUILD_WEBHOOK_URL: process.env.GUILD_WEBHOOK_URL,

	IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID,
	OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,
	SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
	TMDB_API_KEY: process.env.TMDB_API_KEY
});
