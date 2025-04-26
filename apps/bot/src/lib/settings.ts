import { type client, CoreSettings } from '@elvia/core';
import { type PresenceData } from 'discord.js';
import { env } from '@/env.js';

export class Settings extends CoreSettings {
	declare protected data: Partial<client.Settings>;

	public constructor() {
		super();
	}

	public override get presence() {
		return this.data.presence;
	}

	public override get port() {
		this.data.port = env.SERVER_API_PORT || this.data.port;
		return this.data.port;
	}

	public override get auth() {
		this.data.auth = env.SERVER_API_AUTH || this.data.auth;
		return this.data.auth;
	}

	public override get debug() {
		this.data.debugMode = env.DEBUG_MODE || this.data.debugMode;
		return this.data.debugMode;
	}

	public override get unsafe() {
		this.data.unsafeMode = env.UNSAFE_MODE || this.data.unsafeMode;
		return this.data.unsafeMode;
	}
}

declare module '@elvia/core' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace client {
		interface Settings {
			presence?: PresenceData;
			port?: number;
			auth?: string;
			debugMode?: boolean;
			unsafeMode?: boolean;
		}
	}

	interface CoreSettings {
		presence?: PresenceData;
		port?: number;
		auth?: string;
		debug?: boolean;
		unsafe?: boolean;
	}
}
