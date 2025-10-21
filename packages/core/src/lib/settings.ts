import { type PermissionsString, type Snowflake } from 'discord.js';
import YAML from 'yaml';
import fs from 'node:fs';

export interface CoreSettingsData {
	token?: string;
	owners?: Snowflake[];
	defaultPermissions?: PermissionsString[];
}

export class CoreSettings {
	declare protected data: Partial<CoreSettingsData>;

	public constructor() {
		this.load();
	}

	public get token() {
		this.data.token ??= process.env.BOT_TOKEN || process.env.DISCORD_TOKEN;
		return this.data.token;
	}

	public get owners() {
		this.data.owners ??= process.env.BOT_OWNERS?.replace(/, /g, ',')
			.split(',')
			.filter((item) => item.length);
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
