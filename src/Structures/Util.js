const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { connect } = require('mongoose');
const Command = require('./Command.js');
const Event = require('./Event.js');
const Slash = require('./Slash.js');

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

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	trimString(string) {
		let i = string.lastIndexOf(' ', 2047);
		if (i > 2044) i = string.lastIndexOf(' ', i - 1);
		return `${string.substring(0, i + 1)}...`;
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	responseTime(message) {
		const time = Date.now() - message.createdTimestamp;
		return `${time.formatNumber() || 0}ms`;
	}

	checkOwner(target) {
		return this.client.owner.includes(target);
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	formatPerms(perm) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (string) => string.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/To/g, 'to')
			.replace(/And/g, 'and')
			.replace(/Guild/g, 'Server')
			.replace(/Tts/g, 'Text-to-Speech')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	}

	formatLanguage(string) {
		return new Intl.DisplayNames(['en'], { type: 'language' }).of(string);
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

	async loadDatabase() {
		await connect(this.client.mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}

	async loadCommands() {
		return glob(`${this.directory}Commands/**/*.js`).then(commands => {
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
				const event = new File(this.client, name.toLowerCase());
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events directory.`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}

	async loadSlashes() {
		return glob(`${this.directory}Slashes/**/*.js`).then(slashes => {
			for (const slashFile of slashes) {
				delete require.cache[slashFile];
				const { name } = path.parse(slashFile);
				const File = require(slashFile);
				if (!this.isClass(File)) throw new TypeError(`Slash ${name} doesn't export a class.`);
				const slash = new File(this.client, name.toLowerCase());
				if (!(slash instanceof Slash)) throw new TypeError(`Slash ${name} doesn't belong in Slashes directory.`);
				this.client.slashes.set(slash.name, slash);
				this.client.application?.commands.create(slash);
			}
		});
	}

};
