import { type PermissionsString } from 'discord.js';
import { type client } from '@/types/client.js';
import { env } from '@/lib/env.js';
import YAML from 'yaml';
import fs from 'node:fs';

export class CoreSettings {
	declare protected data: client.Settings;

	public constructor() {
		this.load();
	}

	public get id() {
		this.data.id = env.BOT_ID || this.data.id;
		return this.data.id;
	}

	public get token() {
		this.data.token = env.BOT_TOKEN || this.data.token;
		return this.data.token;
	}

	public get owners() {
		this.data.owners = env.BOT_OWNERS || this.data.owners;
		return this.data.owners;
	}

	public get defaultPermissions() {
		return this.data.defaultPermissions || (['SendMessages', 'ViewChannel'] as PermissionsString[]);
	}

	private load() {
		this.data = YAML.parse(fs.readFileSync(`${process.cwd()}/settings.yaml`, 'utf8'));
	}

	public get<K extends keyof client.Settings>(key: K): client.Settings[K] {
		return this.data[key];
	}
}
