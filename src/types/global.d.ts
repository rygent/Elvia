import type BaseClient from '#lib/BaseClient.js';
import type { PermissionsString } from 'discord.js';
import type { EventEmitter } from 'node:events';

declare global {
	interface ClientOptions {
		token: any;
		version: string;
		prefix: string;
		owners: string[] | undefined;
		debug: boolean;
		defaultPermissions: PermissionsString[];
	}

	interface CommandOptions {
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

	interface InteractionCommandOptions extends CommandOptions {
		context?: boolean;
		guildOnly?: boolean;
	}

	interface MessageCommandOptions extends CommandOptions {
		aliases?: string[];
		usage?: string;
	}

	interface EventOptions {
		name: string;
		once?: boolean;
		emitter?: keyof BaseClient | EventEmitter;
	}
}
