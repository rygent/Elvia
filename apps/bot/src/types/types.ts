import type { BaseClient } from '#lib/structures/BaseClient.js';
import type { PermissionsString } from 'discord.js';
import type { EventEmitter } from 'node:events';

export interface ClientOptions {
	token: any;
	version: string;
	prefix: string;
	owners: string[] | undefined;
	debug: boolean;
	defaultPermissions: PermissionsString[];
}

export interface CommandOptions {
	name: string;
	description?: string;
	category?: string;
	memberPermissions?: PermissionsString[];
	clientPermissions?: PermissionsString[];
	cooldown?: number;
	disabled?: boolean;
	ownerOnly?: boolean;
	nsfw?: boolean;
}

export interface InteractionCommandOptions extends CommandOptions {
	context?: boolean;
	guildOnly?: boolean;
}

export interface MessageCommandOptions extends CommandOptions {
	aliases?: string[];
	usage?: string;
}

export interface EventOptions {
	name: string;
	once?: boolean;
	emitter?: keyof BaseClient | EventEmitter;
}
