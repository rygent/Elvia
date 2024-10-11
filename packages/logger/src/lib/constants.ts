import { blueBright, magentaBright, red, redBright, yellowBright } from 'colorette';

export enum color {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	red = 0xff6961
}

export const levels = {
	debug: magentaBright('[DEBUG]'),
	info: blueBright('[INFO]'),
	warn: yellowBright('[WARN]'),
	error: redBright('[ERROR]'),
	fatal: red('[FATAL]')
};
