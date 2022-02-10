const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { connect } = require('mongoose');
const Command = require('./Command.js');
const Event = require('./Event.js');
const Interaction = require('./Interaction.js');

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

	checkOwner(target) {
		return this.client.owners.includes(target);
	}

	categoryCheck(category, message) {
		category = category.toLowerCase();
		switch (category) {
			case 'developer':
				return this.checkOwner(message.author.id);
			case 'nsfw':
				return message.channel.nsfw;
			default:
				return true;
		}
	}

	removeDuplicates(array) {
		return [...new Set(array)];
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	truncateString(string, maxLen = 100) {
		let i = string?.lastIndexOf(' ', maxLen);
		if (i > maxLen - 3) {
			i = string?.lastIndexOf(' ', i - 1);
		}
		return string?.length > maxLen ? `${string.substring(0, i)}...` : string;
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	formatPermission(permission) {
		return permission.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (string) => string.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/To|And|In\b/g, (string) => string.toLowerCase())
			.replace(/ Instant| Embedded/g, '')
			.replace(/Guild/g, 'Server')
			.replace(/Moderate/g, 'Timeout')
			.replace(/Tts/g, 'Text-to-Speech')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, { style = 'short', type = 'conjunction' } = {}) {
		return new Intl.ListFormat('en-US', { style, type }).format(array);
	}

	formatLanguage(string, { type = 'language', languageDisplay = 'standard' } = {}) {
		return new Intl.DisplayNames('en-US', { type, languageDisplay }).of(string);
	}

	async loadDatabases() {
		return connect(this.client.mongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}

	async loadCommands() {
		return glob(`${this.directory}Commands/Message/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
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
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args) => event.run(...args));
			}
		});
	}

	async loadInteractions() {
		return glob(`${this.directory}Commands/Interaction/**/*.js`).then(interactions => {
			for (const interactionFile of interactions) {
				delete require.cache[interactionFile];
				const { name } = path.parse(interactionFile);
				const File = require(interactionFile);
				if (!this.isClass(File)) throw new TypeError(`Interaction ${name} doesn't export a class.`);
				const interaction = new File(this.client, name);
				if (!(interaction instanceof Interaction)) throw new TypeError(`Interaction ${name} doesn't belong in Interactions directory.`);
				let command;
				if (interaction.subCommand) {
					if (interaction.subCommandGroup) {
						command = `${interaction.name}-${interaction.subCommandGroup}-${interaction.subCommand}`;
					} else {
						command = `${interaction.name}-${interaction.subCommand}`;
					}
				} else {
					command = interaction.name;
				}
				this.client.interactions.set(command, interaction);
			}
		});
	}

};
