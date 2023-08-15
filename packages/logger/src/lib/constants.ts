import { blueBright, greenBright, magentaBright, redBright, yellowBright } from 'colorette';

export enum color {
	red = 0xff6961
}

export const levels = {
	syslog: blueBright('[SYSLOG]'),
	syserr: redBright('[SYSERR]'),
	warn: yellowBright('[WARN]'),
	info: greenBright('[INFO]'),
	debug: magentaBright('[DEBUG]')
};
