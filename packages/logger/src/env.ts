import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
	DEBUG_MODE: z.boolean(),
	LOGGER_WEBHOOK_URL: z.string().url(),
	TIMEZONE: z.string().optional()
});

export const env = envSchema.parse({
	DEBUG_MODE: process.env.DEBUG_MODE === 'true',
	LOGGER_WEBHOOK_URL: process.env.LOGGER_WEBHOOK_URL,
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	TIMEZONE: process.env.TIMEZONE || process.env.TZ
});
