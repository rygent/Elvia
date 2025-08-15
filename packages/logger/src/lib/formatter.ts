import * as winston from 'winston';
import {
	blackBright,
	blueBright,
	gray,
	greenBright,
	italic,
	red,
	redBright,
	whiteBright,
	yellowBright
} from 'colorette';
import moment from 'moment';

export const levels = {
	fatal: 0,
	error: 1,
	warn: 2,
	info: 3,
	debug: 4,
	trace: 5
};

export const levelColors = {
	fatal: red,
	error: redBright,
	warn: yellowBright,
	info: greenBright,
	debug: blueBright,
	trace: gray
};

function stackTrace(stack: string) {
	if (!stack) return '';

	return `\n${' '.repeat(4)}${stack.replace(/(\r\n|\n|\r)/gm, '$1  ')}`;
}

export function formatters(options: { colorize: boolean }) {
	return winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ timestamp, level, message, ...info }) => {
			let formattedTimestamp = moment(timestamp as string).format('DD/MM/YYYY HH:mm:ss z');
			let formattedLevel = level.toUpperCase();
			let formattedStack = '';

			if (options.colorize) {
				formattedTimestamp = blackBright(italic(moment(timestamp as string).format('DD/MM/YYYY HH:mm:ss z')));
				formattedLevel = Reflect.get(levelColors, level)(level.toUpperCase());
			}

			if (info.error && info.error instanceof Error) {
				const stack = stackTrace(info.error.stack!);

				if (options.colorize) {
					formattedStack = whiteBright(italic(stack));
				}

				formattedStack = stack;
			}

			return [`${formattedTimestamp} [${formattedLevel}]: ${message}`, formattedStack].filter(Boolean).join('');
		})
	);
}
