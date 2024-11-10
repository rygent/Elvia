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
		format.printf(({ timestamp, level, message, ...info }) => {
			const formattedTime = moment(timestamp as string).format('DD/MM/YYYY HH:mm:ss z');
			const formattedLevel = color ? Reflect.get(customLevelColor, level).toUpperCase() : level.toUpperCase();
			const formattedShard = `[${(info.shardId as string) ?? 'M'}]`;

			const lines: string[] = [
				`${color ? blackBright(italic(formattedTime)) : formattedTime} [${formattedLevel}]: ${color ? cyanBright(formattedShard) : formattedShard} ${message}`
			];

			if (info.error) {
				lines.push(
					color
						? whiteBright(italic(getStackTrace((info.error as Error).stack as string)))
						: getStackTrace((info.error as Error).stack as string)
				);
			}

			return lines.join('');
		})
	);
}
