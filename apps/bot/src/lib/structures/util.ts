import type { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import { Listener } from '@/lib/structures/listener.js';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const jiti = createJiti(import.meta.url);

export class Util {
	public client: Client;

	public constructor(client: Client) {
		this.client = client;
	}

	private isClass(input: unknown): boolean {
		return typeof input === 'function' && typeof input.prototype === 'object' && input.toString().startsWith('class');
	}

	private get directory(): string {
		const main = fileURLToPath(new URL('../../index.js', import.meta.url));
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');
	}

	public async loadContextCommands(): Promise<void> {
		return globby(`${this.directory}commands/context/**/*.js`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const File: any = await jiti.import(commandFile, { default: true });
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client);
				if (!(command instanceof Command)) {
					throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				}
				command.unique = command.name;
				this.client.commands.set(command.unique, command);
			}
		});
	}

	public async loadSlashCommands(): Promise<void> {
		return globby(`${this.directory}commands/slash/**/*.js`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const File: any = await jiti.import(commandFile, { default: true });
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client);
				if (!(command instanceof Command)) {
					throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				}
				const [commandName, subCommandGroup] = path
					.relative(`${this.directory}commands/slash`, path.dirname(commandFile))
					.split(path.sep);
				const unique = [
					...(commandName?.length ? [commandName] : []),
					...(subCommandGroup ? [subCommandGroup] : []),
					command.name
				].join(' ');
				command.unique = unique;
				this.client.commands.set(command.unique, command);
			}
		});
	}

	public async loadListeners(): Promise<void> {
		return globby(`${this.directory}events/**/*.js`).then(async (listeners: string[]) => {
			for (const listenerFile of listeners) {
				const { name } = path.parse(listenerFile);
				const File: any = await jiti.import(listenerFile, { default: true });
				if (!this.isClass(File)) throw new TypeError(`Listener ${name} doesn't export a class!`);
				const listener = new File(this.client);
				if (!(listener instanceof Listener)) {
					throw new TypeError(`Listener ${name} doesn't belong in listeners directory.`);
				}
				listener.emitter[listener.type](listener.name, (...args: unknown[]) => listener.run(...args));
			}
		});
	}
}
