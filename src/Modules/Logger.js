const { inspect } = require('util');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class Logger {

	static log({ content, type = 'log' }) {
		switch (type) {
			case 'log': {
				return this.console({ content, status: 'INFO', color: 'blueBright' });
			}
			case 'warn': {
				return this.console({ content, status: 'WARN', color: 'yellowBright' });
			}
			case 'error': {
				return this.console({ content, status: 'ERROR', color: 'redBright', error: true });
			}
			case 'debug': {
				return this.console({ content, status: 'DEBUG', color: 'blackBright' });
			}
			case 'ready': {
				return this.console({ content, status: 'BOOT', color: 'greenBright' });
			}
			default: throw new TypeError('Logger type must be either warn, debug, log, ready or error.');
		}
	}

	static console({ content, status, color, error = false }) {
		const timestamp = chalk.dim(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const stream = error ? process.stderr : process.stdout;
		stream.write(`${timestamp} [\u200B${chalk[color].bold(status)}\u200B] ${this.clean(content)}\n`);
	}

	static clean(content) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { depth: Infinity });
		return cleaned;
	}

};
