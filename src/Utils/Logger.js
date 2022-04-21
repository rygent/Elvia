const { Console } = require('node:console');
const { inspect } = require('node:util');
const Colorette = require('colorette');
const moment = require('moment');

module.exports = class Logger {

	constructor(options = {}) {
		this.console = new Console({ stdout: options.stdout || process.stdout, stderr: options.stderr || process.stderr });
		this.depth = options.depth || Infinity;
	}

	log(content, options = {}) {
		return this.write(content, { method: 'log', infix: options.infix || 'INFO', color: options.color || 'blueBright' });
	}

	error(content) {
		return this.write(content, { method: 'error', infix: 'ERROR', color: 'redBright' });
	}

	warn(content) {
		return this.write(content, { method: 'warn', infix: 'WARN', color: 'yellowBright' });
	}

	debug(content) {
		return this.write(content, { method: 'debug', infix: 'DEBUG', color: 'blackBright' });
	}

	write(content, options = {}) {
		const timestamp = Colorette.dim(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const infix = `[\u200B${Colorette.bold(Colorette[options.color](options.infix))}\u200B]`;
		return this.console[options.method](timestamp, infix, this.clean(content));
	}

	clean(content) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { colors: Colorette.isColorSupported, depth: this.depth });
		return cleaned;
	}

};
