import { CoreCommand, type CoreClient } from '@elvia/core';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'owofy',
			description: 'Transform your text into owo and uwu.',
			options: [
				{
					name: 'text',
					description: 'Text to transform.',
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
