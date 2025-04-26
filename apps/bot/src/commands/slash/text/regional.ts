import { CoreClient, CoreCommand } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: 'regional',
			description: 'Transform your text to regional indicators.',
			options: [
				{
					name: 'text',
					description: 'Text to transform.',
					type: ApplicationCommandOptionType.String,
					max_length: 256,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: regional(text) });
	}
}

const regionalTable = {
	A: '🇦',
	B: '🇧',
	C: '🇨',
	D: '🇩',
	E: '🇪',
	F: '🇫',
	G: '🇬',
	H: '🇭',
	I: '🇮',
	J: '🇯',
	K: '🇰',
	L: '🇱',
	M: '🇲',
	N: '🇳',
	O: '🇴',
	P: '🇵',
	Q: '🇶',
	R: '🇷',
	S: '🇸',
	T: '🇹',
	U: '🇺',
	V: '🇻',
	W: '🇼',
	X: '🇽',
	Y: '🇾',
	Z: '🇿',

	'0': '0️⃣',
	'1': '1️⃣',
	'2': '2️⃣',
	'3': '3️⃣',
	'4': '4️⃣',
	'5': '5️⃣',
	'6': '6️⃣',
	'7': '7️⃣',
	'8': '8️⃣',
	'9': '9️⃣',

	'!': '❗',
	'?': '❓',
	'+': '➕',
	'-': '➖',
	'×': '✖️',
	'*': '*️⃣',
	$: '💲',
	'/': '➗'
};

function regional(input: string): string {
	let result = '';
	let char: string;

	input = input.toUpperCase().split('').join(' ');
	for (let d = 0, chars = input.length; d < chars; d++) {
		char = Reflect.get(regionalTable, input.charAt(d));
		if (typeof char === 'undefined') char = ' ';
		result += char;
	}

	return result;
}
