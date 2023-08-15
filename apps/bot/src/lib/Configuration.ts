import type { PermissionsString } from 'discord.js';
import { Env } from '@aviana/env';
import pkg from '../../package.json' assert { type: 'json' };

export const token = Env.DiscordToken;
export const version = (Env.ClientVersion ??= pkg.version);
export const prefix = Env.ClientPrefix;
export const owners = Env.ClientOwners;
export const debug = Env.DebugMode;
export const defaultPermissions = ['SendMessages', 'ViewChannel'] as PermissionsString[];
