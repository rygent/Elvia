import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DISCORD_APPLICATION_ID: z.string().min(17).max(20),
		DISCORD_APPLICATION_SECRET: z.string(),

		AUTH_URL: z.preprocess(
			(string) => process.env.VERCEL_URL ?? string,
			process.env.VERCEL_URL ? z.string() : z.string().url().optional()
		),
		AUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),

		JWT_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional()
	},
	runtimeEnv: {
		DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
		DISCORD_APPLICATION_SECRET: process.env.DISCORD_APPLICATION_SECRET,

		AUTH_URL: process.env.AUTH_URL,
		AUTH_SECRET: process.env.AUTH_SECRET,
		JWT_SECRET: process.env.JWT_SECRET
	},
	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true'
});
