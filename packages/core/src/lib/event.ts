import { type CoreClient } from '@/lib/client.js';
import { type Events } from 'discord.js';
import { type Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export interface EventOptions {
	name: Events | string;
	once?: boolean;
	emitter?: keyof CoreClient | EventEmitter;
}

export abstract class CoreEvent extends EventEmitter {
	protected client: CoreClient<true>;
	public readonly name: Events | string;
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

	public override toString(): string {
		return this.name;
	}
}
