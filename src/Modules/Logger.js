const chalk = require('chalk');

module.exports = class Logger {

	static log({ content, type = 'log' }) {
		switch (type) {
			case 'log': {
				return console.log(`[${chalk.blueBright('INFO')}] ${content}`);
			}
			case 'warn': {
				return console.log(`[${chalk.yellowBright('WARN')}] ${content}`);
			}
			case 'error': {
				return console.log(`[${chalk.redBright('ERROR')}] ${content}`);
			}
			case 'debug': {
				return console.log(`[${chalk.grey('DEBUG')}] ${content}`);
			}
			case 'ready': {
				return console.log(`[${chalk.greenBright('BOOT')}] ${content}`);
			}
			default: throw new TypeError('Logger type must be either warn, debug, log, ready or error.');
		}
	}

};
