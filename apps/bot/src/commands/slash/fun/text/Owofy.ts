import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'text owofy',
			description: 'Transform your text into owo and uwu.',
			category: 'Fun'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const text = interaction.options.getString('text', true);

		return interaction.reply({ content: owofy(text) });
	}
}

const faces = [
	'(*^ω^)',
	'(◕‿◕✿)',
	'(◕ᴥ◕)',
	'ʕ•ᴥ•ʔ',
	'ʕ￫ᴥ￩ʔ',
	'(*^.^*)',
	'owo',
	'(｡♥‿♥｡)',
	'uwu',
	'(*￣з￣)',
	'>w<',
	'^w^',
	'(つ✧ω✧)つ',
	'(/ =ω=)/'
];

function owofy(input: string): string {
	return input
		.replace(/[lr]/g, 'w')
		.replace(/[LR]/g, 'W')
		.replace(/(n)([aeiou])/gi, '$1y$2')
		.replace(/ove/g, 'uv')
		.replace(/!+/g, `! ${Reflect.get(faces, Math.floor(Math.random() * faces.length))}`);
}
