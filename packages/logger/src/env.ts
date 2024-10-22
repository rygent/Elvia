import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	DebugMode: z.boolean(),
	LoggerWebhookUrl: z.string().url(),
	Timezone: z.string().optional()
});

const data = schema.parse({
	DebugMode: process.env.DEBUG_MODE === 'true',
	LoggerWebhookUrl: process.env.LOGGER_WEBHOOK_URL,
	Timezone: process.env.TIMEZONE ?? process.env.TZ
});

export function env<K extends keyof typeof data>(key: K) {
	return data[key];
}
