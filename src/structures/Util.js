const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { readdir } = require('fs');
const Command = require('./Command.js');

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadCommands() {
		return glob(`${this.directory}modules/commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands.`);
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
		// eslint-disable-next-line consistent-return
		return readdir('./src/modules/events/', (err, files) => {
			if (err) return console.error(err);
			files.forEach(file => {
				const eventName = file.split('.')[0];
				const event = new (require(`../modules/events/${file}`))(this.client);
				this.client.on(eventName, (...args) => event.run(...args));
				delete require.cache[require.resolve(`../modules/events/${file}`)];
			});
		});
	}

};
