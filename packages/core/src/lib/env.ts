import { z } from 'zod';
import 'dotenv/config';

export const envSchema = z.object({
	BOT_ID: z.string().min(17).max(20).optional(),
	BOT_TOKEN: z.string().optional(),
	BOT_OWNERS: z.string().min(17).max(20).array().optional()
});

export const env = envSchema.parse({
	BOT_ID: process.env.BOT_ID,
	BOT_TOKEN: process.env.BOT_TOKEN || process.env.DISCORD_TOKEN,
	BOT_OWNERS: process.env.BOT_OWNERS?.replace(/, /g, ',')
		.split(',')
		.filter((item) => item.length)
});
