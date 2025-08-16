import { ChannelType } from 'discord-api-types/v10';
import {
	type Channel,
	type GuildChannel,
	type Message,
	type StageChannel,
	type ThreadChannel,
	type VoiceChannel
} from 'discord.js';
import { isNullish, type Nullish } from '@sapphire/utilities';

export function formatArray(
	input: string[],
	options: { style?: Intl.ListFormatStyle; type?: Intl.ListFormatType } = {}
): string {
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
		.replace(/To|In\b/g, (txt) => txt.toLowerCase())
		.replace(/ Instant| Embedded/g, '')
		.replace(/Guild/g, 'Server')
		.replace(/Moderate/g, 'Timeout')
		.replace(/TTS/g, 'Text-to-Speech')
		.replace(/Use VAD/g, 'Use Voice Activity');
}

export function isNsfwChannel(channel: Channel | Nullish): boolean {
	if (isNullish(channel)) return false;

	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (channel.type) {
		case ChannelType.DM:
			return true;
		case ChannelType.GroupDM:
		case ChannelType.GuildCategory:
		case ChannelType.GuildStageVoice:
		case ChannelType.GuildVoice:
			return false;
		case ChannelType.GuildAnnouncement:
		case ChannelType.GuildText:
		case ChannelType.GuildForum:
		case ChannelType.GuildMedia:
			return (channel as Exclude<Extract<Message['channel'], GuildChannel>, VoiceChannel | StageChannel>).nsfw;
		case ChannelType.AnnouncementThread:
		case ChannelType.PublicThread:
		case ChannelType.PrivateThread:
			return Boolean((channel as ThreadChannel).parent?.nsfw);
		default:
			return false;
	}
}

export function sentenceCase(input: string): string {
	return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
}

export function shuffleArray(input: any[]): any[] {
	for (let i = input.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[input[i], input[j]] = [input[j], input[i]];
	}
	return input;
}

export function slugify(input: string): string {
	return input
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/&/g, '-and-')
		.replace(/[^\w\\-]+/g, '')
		.replace(/\\-\\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export function titleCase(input: string): string {
	return input.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
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
