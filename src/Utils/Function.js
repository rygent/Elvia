import { ChannelType } from 'discord-api-types/v10';
import { verifyString } from 'discord.js';

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

export function rgbToHex(rgb) {
	const [r, g, b] = rgb.match(/\d+/g).map(num => +num);
	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function splitMessage(text, { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}) {
	text = verifyString(text);
	if (text.length <= maxLength) return [text];
	let splitString = [text];
	if (Array.isArray(char)) {
		while (char.length > 0 && splitString.some(elem => elem.length > maxLength)) {
			const currentChar = char.shift();
			if (currentChar instanceof RegExp) {
				splitString = splitString.flatMap(chunk => chunk.match(currentChar));
			} else {
				splitString = splitString.flatMap(chunk => chunk.split(currentChar));
			}
		}
	} else {
		splitString = text.split(char);
	}
	if (splitString.some(elem => elem.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
	const messages = [];
	let msg = '';
	for (const chunk of splitString) {
		if (msg && (msg + char + chunk + append).length > maxLength) {
			messages.push(msg + append);
			msg = prepend;
		}
		msg += (msg && msg !== prepend ? char : '') + chunk;
	}
	return messages.concat(msg).filter(m => m);
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
