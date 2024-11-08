import type { PermissionsString } from 'discord.js';
import type { client } from '@/types/types.js';
import { env } from '@/env.js';

export class Settings {
	protected declare data: Partial<client.Settings>;

	public constructor() {
		this.data = {};
	}

	public get token(): string {
		this.data.token ??= env.DISCORD_TOKEN;
		return this.data.token;
	}

	public get owners(): string[] {
		this.data.owners ??= env.CLIENT_OWNERS;
		return this.data.owners;
	}

	public get defaultPermissions(): PermissionsString[] {
		this.data.defaultPermissions ??= ['SendMessages', 'ViewChannel'];
		return this.data.defaultPermissions;
	}

	public get debug(): boolean {
		this.data.debug ??= env.DEBUG_MODE;
		return this.data.debug;
	}

	public get unsafeMode(): boolean {
		this.data.unsafeMode ??= env.UNSAFE_MODE;
		return this.data.unsafeMode;
	}

	public get<Key extends keyof client.Settings>(key: Key): client.Settings[Key] {
		return this.data[key];
	}
}
