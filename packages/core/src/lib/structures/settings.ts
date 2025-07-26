import { type PermissionsString, type Snowflake } from 'discord.js';
import { env } from '@/lib/env.js';
import YAML from 'yaml';
import fs from 'node:fs';

export interface CoreSettingsData {
	id?: string;
	token?: string;
	owners?: Snowflake[];
	defaultPermissions?: PermissionsString[];
}

export class CoreSettings {
	declare protected data: Partial<CoreSettingsData>;

	public constructor() {
		this.load();
	}

	public get id() {
		this.data.id ??= env.BOT_ID;
		return this.data.id;
	}

	public get token() {
		this.data.token ??= env.BOT_TOKEN;
		return this.data.token;
	}

	public get owners() {
		this.data.owners ??= env.BOT_OWNERS;
		return this.data.owners;
	}

	public get defaultPermissions() {
		return this.data.defaultPermissions ?? ['SendMessages', 'ViewChannel'];
	}

	private load() {
		this.data = YAML.parse(fs.readFileSync(`${process.cwd()}/settings.yaml`, 'utf8'));
	}

	public get<Key extends keyof CoreSettingsData>(key: Key): CoreSettingsData[Key] {
		return this.data[key];
	}
}
