import type { BaseClient } from '@/structures/client.js';
import type { BaseListenerOptions } from '@/types.js';
import type { Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export abstract class BaseListener extends EventEmitter {
	protected client: BaseClient<true>;
	public name: string;
	public type: 'once' | 'on';
	public emitter: EventEmitter;

	public constructor(client: BaseClient<true>, options: BaseListenerOptions) {
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
