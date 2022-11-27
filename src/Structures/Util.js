import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import { globby } from 'globby';
import path from 'node:path';
import Interaction from './Interaction.js';
import Command from './Command.js';
import Event from './Event.js';
export * from '../Utils/Function.js';

export default class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().slice(0, 5) === 'class';
	}

	get directory() {
		const main = fileURLToPath(new URL('../index.js', import.meta.url));
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');
	}

	async loadInteractions() {
		return globby(`${this.directory}Commands/?(Context|Slash)/**/*.js`).then(async (interactions) => {
			for (const interactionFile of interactions) {
				const { name } = path.parse(interactionFile);
				const { default: File } = await import(pathToFileURL(interactionFile));
				if (!this.isClass(File)) throw new TypeError(`Interaction ${name} doesn't export a class.`);
				const interaction = new File(this.client, name.toLowerCase());
				if (!(interaction instanceof Interaction)) throw new TypeError(`Interaction ${name} doesn't belong in Interactions directory.`);
				this.client.interactions.set(interaction.name.join('-'), interaction);
			}
		});
	}

	async loadCommands() {
		return globby(`${this.directory}Commands/?(Message)/**/*.js`).then(async (commands) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const { default: File } = await import(pathToFileURL(commandFile));
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands directory.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadEvents() {
		return globby(`${this.directory}Events/**/*.js`).then(async (events) => {
			for (const eventFile of events) {
				const { name } = path.parse(eventFile);
				const { default: File } = await import(pathToFileURL(eventFile));
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args) => event.run(...args));
			}
		});
	}

}
