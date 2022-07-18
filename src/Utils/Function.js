import { ChannelType } from 'discord-api-types/v10';
import he from 'he';

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
		case ChannelType.GroupDM:
		case ChannelType.GuildCategory:
		case ChannelType.GuildNews:
		case ChannelType.GuildNewsThread:
		case ChannelType.GuildPublicThread:
			return Boolean(channel.parent?.nsfw);
		case ChannelType.GuildPrivateThread:
		case ChannelType.GuildStageVoice:
		case ChannelType.GuildDirectory:
		case ChannelType.GuildForum:
	}
}

export function parseHTMLEntity(string) {
	const excessiveNewLinesRegex = /\n{3,}/g;
	const htmlEntityRegex = /<\/?(i|b|br)>/g;
	const htmlEntityReplacements = Object.freeze({
		i: '',
		em: '',
		var: '',
		b: '',
		br: '\n',
		code: '',
		pre: '',
		mark: '',
		kbd: '',
		s: '',
		wbr: '',
		u: ''
	});
	return he.decode(string?.replace(htmlEntityRegex, (_, type) => htmlEntityReplacements[type]))
		.replace(excessiveNewLinesRegex, '\n\n');
}

export function rgbToHex(rgb) {
	const [r, g, b] = rgb.match(/\d+/g).map(num => +num);
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function splitText(str, length, char = ' ') {
	const x = str.substring(0, length).lastIndexOf(char);
	const pos = x === -1 ? length : x;
	return str.substring(0, pos);
}

export function trimArray(array, length = 10) {
	if (array.length > length) {
		const len = array.length - length;
		array = array.slice(0, length);
		array.push(`${len} more...`);
	}
	return array;
}

export function cutText(str, length) {
	if (str.length < length) return str;
	const cut = splitText(str, length - 3);
	if (cut.length < length - 3) return `${cut}...`;
	return `${cut.slice(0, length - 3)}...`;
}
