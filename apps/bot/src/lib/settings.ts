import type { PermissionsString } from 'discord.js';
import type { client } from '@/types/types.js';
import { env } from '@/env.js';

export class Settings {
	protected declare data: Partial<client.Settings>;

	public constructor() {
		this.data = {};
	}

	public get token(): string {
		this.data.token ??= env.DiscordToken;
		return this.data.token;
	}

	public get owners(): string[] {
		this.data.owners ??= env.ClientOwners;
		return this.data.owners;
	}

	public get defaultPermissions(): PermissionsString[] {
		this.data.defaultPermissions ??= ['SendMessages', 'ViewChannel'];
		return this.data.defaultPermissions;
	}

	public get debug(): boolean {
		this.data.debug ??= env.DebugMode;
		return this.data.debug;
	}

	public get unsafeMode(): boolean {
		this.data.unsafeMode ??= env.UnsafeMode;
		return this.data.unsafeMode;
	}

	public get<Key extends keyof Partial<client.Settings>>(key: Key): client.Settings[Key] {
		return this.data[key];
	}
}
