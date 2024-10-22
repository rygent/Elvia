import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	DiscordToken: z.string(),
	DiscordApplicationId: z.string().min(17).max(20),
	ClientOwners: z.string().min(17).max(20).array(),

	DebugMode: z.boolean(),
	UnsafeMode: z.boolean()
});

export const env = schema.parse({
	DiscordToken: process.env.DISCORD_TOKEN,
	DiscordApplicationId: process.env.DISCORD_APPLICATION_ID,
	ClientOwners: process.env.CLIENT_OWNERS?.split(',').filter((item) => item.length),

	DebugMode: process.env.DEBUG_MODE?.toLowerCase() === 'true',
	UnsafeMode: process.env.UNSAFE_MODE?.toLowerCase() === 'true'
});
