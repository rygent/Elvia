import { italic, whiteBright } from 'colorette';

export function getStackTrace(stack: string, color: boolean) {
	if (!stack) return '';

	const trace = `\n${' '.repeat(4)}${stack.replace(/(\r\n|\n|\r)/gm, '$1  ')}`;
	return color ? whiteBright(italic(trace)) : trace;
}
