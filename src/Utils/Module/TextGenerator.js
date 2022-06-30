import { charTable, flipTable, numberWords, tinyCapital } from '../../Assets/js/TextData.js';
import Faces from '../../Assets/json/Faces.json' assert { type: 'json' };

Object.keys(flipTable).forEach((key) => {
	var value = flipTable[key];
	if (!flipTable[value]) {
		flipTable[value] = key;
	}
});

export function flip(text) {
	var result = '',
		c = text.length,
		ch = '';
	for (; c >= 0; --c) {
		ch = text.charAt(c);
		result += flipTable[ch] || flipTable[ch.toLowerCase()] || ch;
	}
	return result;
}

export function owofy(text) {
	return text.replace(/[lr]/g, 'w')
		.replace(/[LR]/g, 'W')
		.replace(/(n)([aeiou])/gi, '$1y$2')
		.replace(/ove/g, 'uv')
		.replace(/!+/g, `! ${Faces[Math.floor(Math.random() * Faces.length)]}`);
}

export function regional(text) {
	text = [...text.toLowerCase()];
	let finalString = '';
	for (let i = 0; i < text.length; i++) {
		const rawChar = text[i];
		let emojiText = '';
		if (rawChar.match(/[a-z]/i)) {
			emojiText = `regional_indicator_${rawChar}`;
		} else if (rawChar.match(/[0-9]/i)) {
			emojiText = `${numberWords[parseInt(rawChar)]}`;
		} else if (rawChar !== ' ') {
			const symbol = charTable[rawChar];
			if (!symbol) continue;
			emojiText = symbol;
		} else {
			finalString += `   `;
			continue;
		}
		finalString += `:${emojiText}: `;
	}
	return finalString.trimEnd();
}

export function reverse(text) {
	return text.split('').reverse().join('');
}

export function smallcaps(text) {
	let c = '';
	let a;

	text = text.toUpperCase();
	for (let d = 0, e = text.length; d < e; d++) {
		// eslint-disable-next-line no-sequences, no-unused-expressions
		a = tinyCapital[text.charAt(d)],
		typeof a === 'undefined' && (a = text.charAt(d)),
		c += a;
	}
	return c;
}

export function spongemock(text) {
	return text.split('').map((str, i) => i % 2 === 0 ? str.toLowerCase() : str.toUpperCase()).join('');
}

export function vaporwave(text) {
	return text.replace(/[a-zA-Z0-9!\\?\\.'";:\]\\[}{\\)\\(@#\\$%\\^&\\*\-_=\\+`~><]/g, (char) => String.fromCharCode(0xfee0 + char.charCodeAt(0))).replace(/ /g, '　');
}
