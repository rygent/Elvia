import { verifyString } from 'discord.js';

export * from './Module/TextManipulation.js';

export function rgbToHex(rgb) {
	const [r, g, b] = rgb.match(/\d+/g).map(num => +num);
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function splitMessage(text, { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}) {
	text = verifyString(text);
	if (text.length <= maxLength) return [text];
	let splitText = [text];
	if (Array.isArray(char)) {
		while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
			const currentChar = char.shift();
			if (currentChar instanceof RegExp) {
				splitText = splitText.flatMap(chunk => chunk.match(currentChar));
			} else {
				splitText = splitText.flatMap(chunk => chunk.split(currentChar));
			}
		}
	} else {
		splitText = text.split(char);
	}
	if (splitText.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
	const messages = [];
	let msg = '';
	for (const chunk of splitText) {
		if (msg && (msg + char + chunk + append).length > maxLength) {
			messages.push(msg + append);
			msg = prepend;
		}
		msg += (msg && msg !== prepend ? char : '') + chunk;
	}
	return messages.concat(msg).filter(m => m);
}
