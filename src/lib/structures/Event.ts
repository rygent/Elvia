import type BaseClient from '../BaseClient.js';
import type { Client, ClientEvents } from 'discord.js';
import type { RestEvents } from '@discordjs/rest';
import type { Awaitable } from '@sapphire/utilities';
import type { EventEmitter } from 'node:events';

export default abstract class Event {
	public client: BaseClient<true>;
	public name: string;
	public type: 'once' | 'on';
	public emitter: EventEmitter;

	public constructor(client: BaseClient, options: EventOptions) {
		this.client = client;
		this.name = options.name;
		this.type = options.once ? 'once' : 'on';
		this.emitter =
			(typeof options.emitter === 'string'
				? (Reflect.get(this.client, options.emitter) as EventEmitter)
				: options.emitter) ?? this.client;
	}

	public abstract run(...args: unknown[]): Awaitable<unknown>;
}

type EventNames = keyof ClientEvents | keyof RestEvents | 'uncaughtException' | 'unhandledRejection';

interface EventOptions {
	name: EventNames;
	once?: boolean;
	emitter?: keyof Client | EventEmitter;
}
