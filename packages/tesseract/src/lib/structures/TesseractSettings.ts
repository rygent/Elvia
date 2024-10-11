import type { PermissionsString } from 'discord.js';
import type { tesseract } from '@/types.ts';

export class TesseractSettings {
	protected declare data: tesseract.Settings;

	public get token(): string {
		return process.env.DISCORD_TOKEN ?? this.data.token;
	}

	public get owners(): string[] {
		const owners = (process.env.CLIENT_OWNERS as string)
			.split(',')
			.concat(this.data.owners)
			.filter((id) => id);

		return owners;
	}

	public get defaultPermissions(): PermissionsString[] {
		return ['SendMessages', 'ViewChannel'];
	}

	public get debug(): boolean {
		if (process.env.DEBUG_MODE) {
			if (process.env.DEBUG_MODE.toLowerCase() === 'true') {
				return true;
			}
			if (process.env.DEBUG_MODE.toLowerCase() === 'false') {
				return false;
			}
		}
		return this.data.debug;
	}

	public get unsafeMode(): boolean {
		if (process.env.UNSAFE_MODE) {
			if (process.env.UNSAFE_MODE.toLowerCase() === 'true') {
				return true;
			}
			if (process.env.UNSAFE_MODE.toLowerCase() === 'false') {
				return false;
			}
		}
		return this.data.unsafeMode;
	}

	public get<K extends keyof tesseract.Settings>(key: K): tesseract.Settings[K] {
		return this.data[key];
	}
}
