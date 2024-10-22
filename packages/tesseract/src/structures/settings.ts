import type { PermissionsString } from 'discord.js';
import type { tesseract } from '@/types.js';
import { env } from '@/env.js';

export class BaseSettings {
	protected declare data: tesseract.Settings;

	public get token(): string {
		return env.DiscordToken ?? this.data.token;
	}

	public get owners(): string[] {
		return env.ClientOwners ?? this.data.owners;
	}

	public get defaultPermissions(): PermissionsString[] {
		return ['SendMessages', 'ViewChannel'];
	}

	public get debug(): boolean {
		return env.DebugMode ?? this.data.debug;
	}

	public get unsafeMode(): boolean {
		return env.UnsafeMode ?? this.data.unsafeMode;
	}

	public get<K extends keyof tesseract.Settings>(key: K): tesseract.Settings[K] {
		return this.data[key];
	}
}
