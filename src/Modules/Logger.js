const { inspect } = require('node:util');
const colorette = require('colorette');
const moment = require('moment');

module.exports = class Logger {

	constructor(client) {
		this.client = client;
	}

	log(content, options = {}) {
		options.status = options.status || 'INFO';
		options.color = options.color || 'blueBright';
		return this.write(content, { status: options.status, color: options.color });
	}

	error(content) {
		return this.write(content, { status: 'ERROR', color: 'redBright', error: true });
	}

	warn(content) {
		return this.write(content, { status: 'WARN', color: 'yellowBright' });
	}

	debug(content) {
		return this.write(content, { status: 'DEBUG', color: 'blackBright' });
	}

	write(content, options = {}) {
		options.error = options.error || false;
		const timestamp = colorette.dim(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const stream = options.error ? process.stderr : process.stdout;
		stream.write(`${timestamp} [\u200B${colorette.bold(colorette[options.color](options.status))}\u200B] ${this.clean(content)}\n`);
	}

	clean(content) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { depth: Infinity });
		return cleaned;
	}

};
