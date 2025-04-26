import { envSchema } from '@elvia/core';
import { z } from 'zod';
import 'dotenv/config';

const schema = envSchema.extend({
	DISCORD_APPLICATION_ID: z.string().min(17).max(20),
	DEVELOPER_GUILD_ID: z.string().min(17).max(20).optional(),
	DATABASE_URL: z.string().url(),

	SERVER_API_AUTH: z.string().optional(),
	SERVER_API_PORT: z.number().optional(),

	DEBUG_MODE: z.boolean().optional(),
	UNSAFE_MODE: z.boolean().optional(),

	SUPPORT_SERVER_URL: z.string().url(),
	LOGGER_WEBHOOK_URL: z.string().url(),
	GUILD_WEBHOOK_URL: z.string().url(),

	IMGUR_CLIENT_ID: z.string(),
	OPEN_WEATHER_API_KEY: z.string(),
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	TMDB_API_KEY: z.string()
});

export const env = schema.parse({
	BOT_TOKEN: process.env.BOT_TOKEN || process.env.DISCORD_TOKEN,
	BOT_OWNERS: process.env.BOT_OWNERS?.replace(/, /g, ',')
		.split(',')
		.filter((item) => item.length),
	DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
	DEVELOPER_GUILD_ID: process.env.DEVELOPER_GUILD_ID,
	DATABASE_URL: process.env.DATABASE_URL,

	SERVER_API_AUTH: process.env.SERVER_API_AUTH,
	SERVER_API_PORT: Number(process.env.SERVER_API_PORT || process.env.PORT),

	DEBUG_MODE: process.env.DEBUG_MODE === 'true' || process.env.DEBUG === 'true',
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
