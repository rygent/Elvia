import type { Client } from '@/lib/structures/client.js';
import type { ListenerOptions } from '@/types/types.js';
import type { Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export abstract class Listener extends EventEmitter {
	protected client: Client<true>;
	public name: string;
	public type: 'once' | 'on';
	public emitter: EventEmitter;

	public constructor(client: Client<true>, options: ListenerOptions) {
		super();
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
