export function sentenceCase(input: string): string {
	return input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
}

export function titleCase(input: string): string {
	return input.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
