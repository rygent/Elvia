const Faces = require('../../Assets/json/Faces.json');
const numWords = ['zero', 'one', 'two', 'three', 'four',
	'five', 'six', 'seven', 'eight', 'nine'];
const charTable = {
	'!': 'exclamation',
	'?': 'question',
	'+': 'heavy_plus_sign',
	'-': 'heavy_minus_sign',
	'×': 'heavy_multiplication_x',
	'*': 'asterisk',
	'$': 'heavy_dollar_sign', // eslint-disable-line quote-props
	'/': 'heavy_division_sign'
};

const { tinyCapital } = require('../../Assets/js/Text');

exports.owofy = (text) => text.replace(/[lr]/g, 'w')
	.replace(/[LR]/g, 'W')
	.replace(/(n)([aeiou])/gi, '$1y$2')
	.replace(/ove/g, 'uv')
	.replace(/!+/g, `! ${Faces[Math.floor(Math.random() * Faces.length)]}`);

exports.regional = (text) => {
	text = [...text.toLowerCase()];
	let finalString = '';
	for (let i = 0; i < text.length; i++) {
		const rawChar = text[i];
		let emojiText = '';
		if (rawChar.match(/[a-z]/i)) {
			emojiText = `regional_indicator_${rawChar}`;
		} else if (rawChar.match(/[0-9]/i)) {
			emojiText = `${numWords[parseInt(rawChar)]}`;
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
};

exports.reverse = (text) => text.split('').reverse().join('');

exports.smallcaps = (text) => {
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
};

exports.spongemock = (text) => text.split('').map((str, i) => i % 2 === 0 ? str.toLowerCase() : str.toUpperCase()).join('');

exports.vaporwave = (text) => text.replace(/[a-zA-Z0-9!\\?\\.'";:\]\\[}{\\)\\(@#\\$%\\^&\\*\-_=\\+`~><]/g, (char) => String.fromCharCode(0xfee0 + char.charCodeAt(0))).replace(/ /g, '　');
