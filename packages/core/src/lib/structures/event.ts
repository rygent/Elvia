import { CoreClient } from '@/lib/structures/client.js';
import { type EventOptions } from '@/types/event.js';
import { type Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export abstract class CoreEvent extends EventEmitter {
	protected client: CoreClient<true>;
	public readonly name: string;
	public readonly type: 'once' | 'on';
	public readonly emitter: EventEmitter;

	public constructor(client: CoreClient<true>, options: EventOptions) {
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
