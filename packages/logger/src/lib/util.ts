import { blackBright, isColorSupported } from 'colorette';
import { levels } from '@/lib/constants.js';
import { inspect } from 'node:util';
import moment from 'moment';

const levelLength = Math.max(...Object.values(levels).map((text) => text.length));

export function resolveTimestamp(timestamp: string) {
	return `${blackBright(moment(timestamp).format('DD/MM/YYYY HH:mm:ss z'))}`;
}

export function resolveLevel(level: string) {
	return `${(levels as any)[level]}${' '.repeat(levelLength - (levels as any)[level].length)}`.trim();
}

export function clean(input: any, depth?: number) {
	if (typeof input === 'string') return input;
	const cleaned = inspect(input, { colors: isColorSupported, depth: depth ?? 2 });
	return cleaned;
}
