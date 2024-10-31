import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	Port: z.number().optional()
});

export const env = schema.parse({
	Port: process.env.PORT
});
