import type { BaseClient } from '#lib/BaseClient.js';
import { Interaction } from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Interaction {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'text smallcaps',
			description: 'Transform your text into small caps.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: smallcaps(text) });
	}
}

const smallcapsTable = {
	A: 'ᴀ',
	B: 'ʙ',
	C: 'ᴄ',
	D: 'ᴅ',
	E: 'ᴇ',
	F: 'ꜰ',
	G: 'ɢ',
	H: 'ʜ',
	I: 'ɪ',
	J: 'ᴊ',
	K: 'ᴋ',
	L: 'ʟ',
	M: 'ᴍ',
	N: 'ɴ',
	O: 'ᴏ',
	P: 'ᴘ',
	Q: 'ǫ',
	R: 'ʀ',
	S: 's',
	T: 'ᴛ',
	U: 'ᴜ',
	V: 'ᴠ',
	W: 'ᴡ',
	X: 'x',
	Y: 'ʏ',
	Z: 'ᴢ'
};

function smallcaps(input: string): string {
	let result = '';
	let char: string;

	input = input.toUpperCase();
	for (let d = 0, chars = input.length; d < chars; d++) {
		char = Reflect.get(smallcapsTable, input.charAt(d));
		if (typeof char === 'undefined') char = input.charAt(d);
		result += char;
	}
	return result;
}
