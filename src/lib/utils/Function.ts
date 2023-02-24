import { ChannelType } from 'discord-api-types/v10';
import type { AutocompleteInteraction, Channel, CommandInteraction, ThreadChannel } from 'discord.js';
import { isNullish, Nullish } from '@sapphire/utilities';

export function formatArray(input: string[], options: { style?: Intl.ListFormatStyle; type?: Intl.ListFormatType } = {}): string {
	const { style = 'short', type = 'conjunction' } = options;
	return new Intl.ListFormat('en-US', { style, type }).format(input);
}

export function formatBytes(input: number): string {
	if (input === 0) return '0 Bytes';
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(input) / Math.log(1024));
	return `${parseFloat((input / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatNumber(input: number): string {
	return input.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function formatPermissions(input: string): string {
	return input
		.replace(/(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])/g, ' $1')
		.replace(/To|And|In\b/g, txt => txt.toLowerCase())
		.replace(/ Instant| Embedded/g, '')
		.replace(/Guild/g, 'Server')
		.replace(/Moderate/g, 'Timeout')
		.replace(/TTS/g, 'Text-to-Speech')
		.replace(/Use VAD/g, 'Use Voice Activity');
}

export function isNsfwChannel(channel: Channel | Nullish): boolean {
	if (isNullish(channel)) return false;
	switch (channel.type) {
		case ChannelType.GuildText:
			return channel.nsfw;
		case ChannelType.DM:
			return true;
		case ChannelType.PublicThread:
			return Boolean((channel as ThreadChannel).parent?.nsfw);
		case ChannelType.PrivateThread:
			return Boolean((channel as ThreadChannel).parent?.nsfw);
		default:
			return false;
	}
}

export function resolveCommandName(interaction: CommandInteraction<'cached' | 'raw'> | AutocompleteInteraction<'cached' | 'raw'>): string {
	if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return interaction.commandName;

	const topLevelCommand = interaction.commandName;
	const subCommandGroup = interaction.options.getSubcommandGroup(false);
	const subCommand = interaction.options.getSubcommand(false);

	const command = [
		topLevelCommand,
		...(subCommandGroup ? [subCommandGroup] : []),
		...(subCommand ? [subCommand] : [])
	].join(' ');

	return command;
}

export function sentenceCase(input: string): string {
	return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, txt => txt.toUpperCase());
}

export function shuffleArray(input: any[]): any[] {
	for (let i = input.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[input[i], input[j]] = [input[j], input[i]];
	}
	return input;
}

export function slugify(input: string): string {
	return input.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/&/g, '-and-')
		.replace(/[^\w\\-]+/g, '')
		.replace(/\\-\\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export function titleCase(input: string): string {
	return input.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function trimArray(input: any[], options: { length?: number } = {}): any[] {
	const { length = 10 } = options;
	if (input.length > length) {
		const len = input.length - length;
		input = input.slice(0, length);
		input.push(`${len} more...`);
	}
	return input;
}
