import { CoreSettings, type CoreSettingsData } from '@elvia/core';
import { type PresenceData } from 'discord.js';
import { env } from '@/env.js';

interface ExtendedSettingsData extends CoreSettingsData {
	presence?: PresenceData;
	auth?: string;
	port?: number;
	debugMode?: boolean;
}

export class ExtendedSettings extends CoreSettings {
	declare protected data: Partial<ExtendedSettingsData>;

	public constructor() {
		super();
	}

	public override get token() {
		this.data.token ??= env.BOT_TOKEN;
		return this.data.token;
	}

	public override get owners() {
		this.data.owners ??= env.BOT_OWNERS;
		return this.data.owners;
	}

	public get presence() {
		return this.data.presence;
	}

	public get auth() {
		this.data.auth ??= env.SERVER_API_AUTH;
		return this.data.auth;
	}

	public get port() {
		this.data.port ??= env.SERVER_API_PORT;
		return this.data.port;
	}

	public get debug() {
		this.data.debugMode = env.DEBUG_MODE || this.data.debugMode;
		return this.data.debugMode;
	}

	public override get<Key extends keyof ExtendedSettingsData>(key: Key): ExtendedSettingsData[Key] {
		return this.data[key];
	}
}

export function isExtendedSettings(settings: CoreSettings): settings is ExtendedSettings {
	return settings instanceof ExtendedSettings;
}
