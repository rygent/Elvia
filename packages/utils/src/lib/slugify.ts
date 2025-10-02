export function slugify(text: string): string {
	return text
		.trim()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9\\-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}
