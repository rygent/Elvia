import type BaseClient from '../BaseClient.js';
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

export interface InteractionCommandOptions {
	name: string;
	description?: string;
	category?: string;
	memberPermissions?: PermissionsString[];
	clientPermissions?: PermissionsString[];
	cooldown?: number;
	disabled?: boolean;
	context?: boolean;
	guildOnly?: boolean;
	ownerOnly?: boolean;
	nsfw?: boolean;
}

export interface MessageCommandOptions {
	name: string;
	aliases?: string[];
	description?: string;
	category?: string;
	usage?: string;
	memberPermissions?: PermissionsString[];
	clientPermissions?: PermissionsString[];
	cooldown?: number;
	disabled?: boolean;
	ownerOnly?: boolean;
	nsfw?: boolean;
}

export interface EventOptions {
	name: string;
	once?: boolean;
	emitter?: keyof BaseClient | EventEmitter;
}
