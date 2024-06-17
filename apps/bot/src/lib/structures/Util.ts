import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Command } from '@/lib/structures/Command.js';
import { Event } from '@/lib/structures/Event.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { globby } from 'globby';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export class Util {
	public client: BaseClient;

	public constructor(client: BaseClient) {
		this.client = client;
	}

	private isClass(input: unknown): boolean {
		return (
			typeof input === 'function' && typeof input.prototype === 'object' && input.toString().slice(0, 5) === 'class'
		);
	}

	private get directory(): string {
		const main = fileURLToPath(new URL('../../index.js', import.meta.url));
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');
	}

	public async loadInteractions(): Promise<void> {
		return globby(`${this.directory}commands/?(context|slash)/**/*.js`).then(async (interactions: string[]) => {
			for await (const interactionFile of interactions) {
				const { name } = path.parse(interactionFile);
				const { default: File } = await import(pathToFileURL(interactionFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Interaction ${name} doesn't export a class.`);
				const interaction = new File(this.client, name.toLowerCase());
				if (!(interaction instanceof Interaction)) {
					throw new TypeError(`Interaction ${name} doesn't belong in interactions directory.`);
				}
				this.client.interactions.set(interaction.name, interaction);
			}
		});
	}

	public async loadCommands(): Promise<void> {
		return globby(`${this.directory}commands/?(message)/**/*.js`).then(async (commands: string[]) => {
			for await (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const { default: File } = await import(pathToFileURL(commandFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	public async loadEvents(): Promise<void> {
		return globby(`${this.directory}events/**/*.js`).then(async (events: string[]) => {
			for await (const eventFile of events) {
				const { name } = path.parse(eventFile);
				const { default: File } = await import(pathToFileURL(eventFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args: unknown[]) => event.run(...args));
			}
		});
	}
}
