const WordSeparatorCharacter = /[\p{Separator}\p{Punctuation}\p{Control}]/u;

export function truncate(input: string, length: number): string {
	if (input.length <= length) return input;

	const codepoints = [...input];
	if (codepoints.length <= length) return input;

	let lastSeparator = length;
	for (let i = 0; i < length; ++i) {
		if (WordSeparatorCharacter.test(codepoints[i]!)) {
			lastSeparator = i;
		}
	}

	const lastCharacterIndex = lastSeparator === length ? length - 1 : lastSeparator;
	return codepoints.slice(0, lastCharacterIndex).concat('…').join('');
}
