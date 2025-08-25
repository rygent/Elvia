import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		BETTERSTACK_API_KEY: z.string()
	},
	shared: {
		DISCORD_APPLICATION_ID: z.string().min(17).max(20)
	},
	runtimeEnv: {
		DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
		BETTERSTACK_API_KEY: process.env.BETTERSTACK_API_KEY
	},
	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true'
});
