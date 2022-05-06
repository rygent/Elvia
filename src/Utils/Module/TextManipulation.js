exports.reverseText = (text) => text.split('').reverse().join('');
exports.spongemock = (text) => text.split('').map((str, i) => i % 2 === 0 ? str.toLowerCase() : str.toUpperCase()).join('');
