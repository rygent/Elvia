import type { BaseClient } from '@/lib/structures/BaseClient.js';
import type { Awaitable } from '@discordjs/util';
import type { EventOptions } from '@/types/types.js';
import type { EventEmitter } from 'node:events';

export abstract class Event {
	public client: BaseClient<true>;
	public name: string;
	public type: 'once' | 'on';
	public emitter: EventEmitter;

	public constructor(client: BaseClient<true>, options: EventOptions) {
		this.client = client;
		this.name = options.name;
		this.type = options.once ? 'once' : 'on';
		this.emitter =
			(typeof options.emitter === 'string'
				? (Reflect.get(this.client, options.emitter) as EventEmitter)
				: (options.emitter as EventEmitter)) ?? this.client;
	}

	public abstract run(...args: unknown[]): Awaitable<unknown>;
}
