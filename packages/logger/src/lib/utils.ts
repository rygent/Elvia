import { format } from 'winston';
import { blackBright, cyanBright, italic, whiteBright } from 'colorette';
import { customLevelColor } from '@/lib/constants.js';
import moment from 'moment';

function getStackTrace(stack: string) {
	if (!stack) return '';

	const trace = `\n${' '.repeat(4)}${stack.replace(/(\r\n|\n|\r)/gm, '$1  ')}`;
	return trace;
}

export function formatBuilder(color: boolean) {
	return format.combine(
		format.timestamp(),
		format.printf((info) => {
			const time = moment(info.timestamp).format('DD/MM/YYYY HH:mm:ss z');
			const shard = `[${typeof info.shardId !== 'undefined' ? info.shardId : `M`}]`;

			if (color) {
				// @ts-expect-error TS7053: Element implicitly has an 'any' type because expression of type 'string'.
				const level = customLevelColor[info.level](info.level.toUpperCase());

				const result = [
					`${blackBright(italic(time))} [${level}]: ${cyanBright(shard)} ${info.message}`,
					typeof info.error !== 'undefined' ? [whiteBright(italic(getStackTrace(info.error.stack)))] : []
				].join('');

				return result;
			}

			const level = info.level.toUpperCase();

			const result = [
				`${time} [${level}]: ${shard} ${info.message}`,
				typeof info.error !== 'undefined' ? [getStackTrace(info.error.stack)] : []
			].join('');

			return result;
		})
	);
}
