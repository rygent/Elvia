import { type ClientOptions, type PermissionsString, type Snowflake } from 'discord.js';
import { type CoreSettings } from '@/lib/structures/settings.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace client {
	export interface Settings {
		id?: string;
		token?: string;
		owners?: Snowflake[];
		defaultPermissions?: PermissionsString[];
	}
}

export interface CoreClientOptions extends ClientOptions {
	settings?: CoreSettings;
	root?: string;
}
