import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DISCORD_APPLICATION_ID: z.string().min(17).max(20)
	},
	runtimeEnv: {
		DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID
	},
	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true'
});
