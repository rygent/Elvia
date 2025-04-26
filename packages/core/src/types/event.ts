import { type CoreClient } from '@/lib/structures/client.js';
import { EventEmitter } from 'node:events';

export interface EventOptions {
	name: string;
	once?: boolean;
	emitter?: keyof CoreClient | EventEmitter;
}
