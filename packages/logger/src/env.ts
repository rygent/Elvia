import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	DebugMode: z.boolean(),
	LoggerWebhookUrl: z.string().url(),
	Timezone: z.string().optional()
});

export const env = schema.parse({
	DebugMode: process.env.DEBUG_MODE === 'true',
	LoggerWebhookUrl: process.env.LOGGER_WEBHOOK_URL,
	Timezone: process.env.TIMEZONE ?? process.env.TZ
});
