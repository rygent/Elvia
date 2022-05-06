const Faces = require('../../Assets/json/Faces.json');

exports.owofy = (text) => text.replace(/[lr]/g, 'w')
	.replace(/[LR]/g, 'W')
	.replace(/(n)([aeiou])/gi, '$1y$2')
	.replace(/ove/g, 'uv')
	.replace(/!+/g, `! ${Faces[Math.floor(Math.random() * Faces.length)]}`);

exports.reverseText = (text) => text.split('').reverse().join('');

exports.spongemock = (text) => text.split('').map((str, i) => i % 2 === 0 ? str.toLowerCase() : str.toUpperCase()).join('');
