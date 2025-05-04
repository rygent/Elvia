import { ActivityType, GatewayIntentBits } from 'discord-api-types/v10';
import {
	BitField,
	Client as BaseClient,
	PermissionsBitField,
	type PermissionsString,
	Partials,
	Options
} from 'discord.js';
import { Collection } from '@discordjs/collection';
import { Command } from '@/lib/structures/command.js';
import { Util } from '@/lib/structures/util.js';
import { Settings } from '@/lib/settings.js';
import { env } from '@/env.js';
import fs from 'node:fs';

export class Client<Ready extends boolean = boolean> extends BaseClient<Ready> {
	public settings: Settings;

	public commands: Collection<string, Command>;
	public cooldowns: Collection<string, Collection<string, number>>;

	private readonly utils: Util;

	public version: string;
	public defaultPermissions: Readonly<BitField<PermissionsString, bigint>>;

	public constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
			partials: [Partials.Message, Partials.Channel],
			allowedMentions: {
				repliedUser: false
			},
			presence: {
				activities: [...(env.CUSTOM_STATUS ? [{ name: env.CUSTOM_STATUS, type: ActivityType.Custom }] : [])]
			},
			sweepers: {
				...Options.DefaultSweeperSettings,
				messages: {
					interval: 3e2,
					lifetime: 432e2
				}
			}
		});
		this.settings = new Settings();
		this.validate();

		this.commands = new Collection();
		this.cooldowns = new Collection();

		this.utils = new Util(this);

		this.version = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf8')).version;
		this.defaultPermissions = new PermissionsBitField(this.settings.defaultPermissions).freeze();
	}

	private validate() {
		if (!this.settings.token) throw new Error('You must pass the token for the Client.');

		if (!this.settings.owners?.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(this.settings.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');

		if (!this.settings.defaultPermissions.length) {
			throw new Error('You must pass default permission(s) for the Client.');
		}

		if (!Array.isArray(this.settings.defaultPermissions)) {
			throw new TypeError('Permission(s) should be a type of Array<String>.');
		}
	}

	public async start(token = this.settings.token) {
		await this.utils.loadContextCommands();
		await this.utils.loadSlashCommands();
		await this.utils.loadListeners();
		void super.login(token);
	}
}
