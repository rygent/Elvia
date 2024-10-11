import type { PermissionsString } from 'discord.js';
import { Env } from '@/lib/Env.js';
import packageJson from '../../package.json' with { type: 'json' };

export const token = Env.DiscordToken;
export const version = (Env.ClientVersion ??= packageJson.version);
export const owners = Env.ClientOwners;
export const debug = Env.DebugMode;
export const defaultPermissions = ['SendMessages', 'ViewChannel'] as PermissionsString[];
