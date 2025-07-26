import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'flip',
			description: 'Flip your text.',
			options: [
				{
					name: 'text',
					description: 'Text to flip.',
					type: ApplicationCommandOptionType.String,
					max_length: 256,
					required: true
				}
			],
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: flip(text) });
	}
}

const flipTable = {
	A: '∀',
	B: '𐐒',
	C: 'Ɔ',
	E: 'Ǝ',
	F: 'Ⅎ',
	G: 'פ',
	H: 'H',
	I: 'I',
	J: 'ſ',
	L: '˥',
	M: 'W',
	N: 'N',
	P: 'Ԁ',
	R: 'ᴚ',
	T: '⊥',
	U: '∩',
	V: 'Λ',
	Y: '⅄',

	a: 'ɐ',
	b: 'q',
	c: 'ɔ',
	d: 'p',
	e: 'ǝ',
	f: 'ɟ',
	g: 'ƃ',
	h: 'ɥ',
	i: 'ᴉ',
	j: 'ɾ',
	k: 'ʞ',
	m: 'ɯ',
	n: 'u',
	p: 'd',
	q: 'b',
	r: 'ɹ',
	t: 'ʇ',
	u: 'n',
	v: 'ʌ',
	w: 'ʍ',
	y: 'ʎ',

	'1': 'Ɩ',
	'2': 'ᄅ',
	'3': 'Ɛ',
	'4': 'ㄣ',
	'5': 'ϛ',
	'6': '9',
	'7': 'ㄥ',
	'8': '8',
	'9': '6',
	'0': '0',

	'.': '˙',
	',': "'",
	"'": ',',
	'"': ',,',
	'`': ',',
	'<': '>',
	'>': '<',
	'∴': '∵',
	'&': '⅋',
	_: '‾',
	'?': '¿',
	'!': '¡',
	'[': ']',
	']': '[',
	'(': ')',
	')': '(',
	'{': '}',
	'}': '{',

	А: '∀',
	Б: 'ܦ',
	В: 'ꓭ',
	Г: '⅃',
	Д: 'ჩ',
	Е: 'Ǝ',
	З: 'Ɛ',
	Й: 'И̯',
	К: 'ꓘ',
	Л: 'Ѵ',
	М: 'ꟽ',
	П: 'ⵡ',
	Р: 'Ԁ',
	С: 'Ͻ',
	Т: 'ꓕ',
	У: 'ʎ',
	Ц: 'ŉ',
	Ч: 'Ⴙ',
	Ш: 'ᗰ',
	Ь: 'ᑫ',
	Э: 'Є',
	Ю: 'Ꙕ',
	Я: 'ᖉ',

	а: 'ɐ',
	б: 'ܦ',
	в: 'ʚ',
	г: '⅃',
	д: 'ჩ',
	е: 'ǝ',
	з: 'ԑ',
	й: 'и̯',
	к: 'ʞ',
	л: 'ѵ',
	м: 'ᥕ',
	п: '⊔',
	р: 'd',
	с: 'ɔ',
	т: 'ꓕ',
	у: 'ʎ',
	ц: 'ŉ',
	ч: 'h',
	ш: 'm',
	ь: '৭',
	э: 'є',
	ю: 'ꙕ',
	я: 'ʁ'
};

function flip(input: string): string {
	let result = '';
	let chars = input.length;
	let char = '';
	for (; chars >= 0; --chars) {
		char = input.charAt(chars);
		result += Reflect.get(flipTable, char) || Reflect.get(flipTable, char.toLowerCase()) || char;
	}
	return result;
}
