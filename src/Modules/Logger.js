const { inspect } = require('util');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class Logger {

	static log(content, { status = 'INFO', color = 'blueBright' } = {}) {
		return this.console({ content, status, color });
	}

	static error(content) {
		return this.console({ content, status: 'ERROR', color: 'redBright', error: true });
	}

	static warn(content) {
		return this.console({ content, status: 'WARN', color: 'yellowBright' });
	}

	static debug(content) {
		return this.console({ content, status: 'DEBUG', color: 'blackBright' });
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
