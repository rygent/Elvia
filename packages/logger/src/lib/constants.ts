import { blackBright, blueBright, gray, greenBright, italic, red, redBright, yellowBright } from 'colorette';
import { format } from 'winston';
import { getStackTrace } from '@/lib/utils.js';
import moment from 'moment';

export const customLevel = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
	trace: 5
};

const customLevelColor = {
	fatal: red,
	error: redBright,
	warn: yellowBright,
	info: greenBright,
	debug: blueBright,
	trace: gray
};

export const customConsoleFormat = format.combine(
	format.timestamp(),
	format.printf(({ timestamp, level, message, error }) => {
		const time = blackBright(italic(moment(timestamp).format('DD/MM/YYYY HH:mm:ss z')));
		// @ts-expect-error TS7053: Element implicitly has an 'any' type because expression of type 'string'.
		const lvl = customLevelColor[level](level.toUpperCase());

		if (typeof error !== 'undefined') {
			return `${time} [${lvl}]: ${message}${getStackTrace(error.stack, true)}`;
		}

		return `${time} [${lvl}]: ${message}`;
	})
);

export const customFileFormat = format.combine(
	format.timestamp(),
	format.printf(({ timestamp, level, message, error }) => {
		const time = moment(timestamp).format('DD/MM/YYYY HH:mm:ss z');
		const lvl = level.toUpperCase();

		if (typeof error !== 'undefined') {
			return `${time} [${lvl}]: ${message}${getStackTrace(error.stack, false)}`;
		}

		return `${time} [${lvl}]: ${message}`;
	})
);
