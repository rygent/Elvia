import { ChannelType } from 'discord-api-types/v10';

export function formatArray(array, { style = 'short', type = 'conjunction' } = {}) {
	return new Intl.ListFormat('en-US', { style, type }).format(array);
}

export function formatBytes(bytes) {
	if (bytes === 0) return '0 Bytes';
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatLanguage(string, { type = 'language', languageDisplay = 'standard' } = {}) {
	return new Intl.DisplayNames('en-US', { type, languageDisplay }).of(string);
}

export function formatNumber(number) {
	return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function formatPermissions(permissions) {
	return permissions.replace(/(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])/g, ' $1')
		.replace(/To|And|In\b/g, (txt) => txt.toLowerCase())
		.replace(/ Instant| Embedded/g, '')
		.replace(/Guild/g, 'Server')
		.replace(/Moderate/g, 'Timeout')
		.replace(/TTS/g, 'Text-to-Speech')
		.replace(/Use VAD/g, 'Use Voice Activity');
}

export function isRestrictedChannel(channel) {
	if (!channel) return false;
	switch (channel.type) {
		case ChannelType.GuildText:
			return channel.nsfw;
		case ChannelType.DM:
			return true;
		case ChannelType.GuildVoice:
			return channel.nsfw;
		case ChannelType.PublicThread:
			return channel.parent?.nsfw;
		case ChannelType.PrivateThread:
			return channel.parent?.nsfw;
		default:
			return false;
	}
}

export function sentenceCase(string) {
	return string.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
}

export function titleCase(string) {
	return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function trimArray(array, length = 10) {
	if (array.length > length) {
		const len = array.length - length;
		array = array.slice(0, length);
		array.push(`${len} more...`);
	}
	return array;
}
