import { BitField, Client, Options, Partials, PermissionsBitField, type PermissionsString } from 'discord.js';
import { AllowedMentionsTypes, GatewayIntentBits } from 'discord-api-types/v10';
import { Collection } from '@discordjs/collection';
import type { Interaction } from '#lib/structures/Interaction.js';
import type { Command } from '#lib/structures/Command.js';
import type { Event } from '#lib/structures/Event.js';
import { Util } from '#lib/structures/Util.js';
import { Logger } from '@aviana/logger';
import semver from 'semver';

export class BaseClient<Ready extends boolean = boolean> extends Client<Ready> {
	public interactions: Collection<string, Interaction>;
	public commands: Collection<string, Command>;
	public aliases: Collection<string, string>;
	public events: Collection<string, Event>;
	public cooldowns: Collection<string, Collection<string, number>>;

	public logger: Logger;
	public utils: Util;

	public version!: string;
	public debug!: boolean;

	public prefix: string | undefined;
	public owners: string[] | undefined;
	public defaultPermissions!: Readonly<BitField<PermissionsString, bigint>>;

	// eslint-disable-next-line no-undef
	public constructor(options: ClientOptions) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			partials: [Partials.Message, Partials.Channel],
			allowedMentions: {
				parse: [AllowedMentionsTypes.User, AllowedMentionsTypes.Role],
				repliedUser: false
			},
			sweepers: {
				...Options.DefaultSweeperSettings,
				messages: {
					interval: 18e1,
					lifetime: 9e2
				}
			}
		});
		void this.validate(options);

		this.interactions = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.cooldowns = new Collection();

		this.logger = new Logger(this);
		this.utils = new Util(this);

		this.version = options.version;
		this.debug = options.debug;
	}

	// eslint-disable-next-line no-undef
	private validate(options: ClientOptions) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (semver.lt(process.versions.node, '18.12.0')) {
			throw new Error('This client requires Node.JS v18.12.0 or higher.');
		}

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners?.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		if (!Array.isArray(options.defaultPermissions)) {
			throw new TypeError('Permission(s) should be a type of Array<String>.');
		}
		this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();
	}

	public async start(token = this.token) {
		await this.utils.loadInteractions();
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		void super.login(token as string);
	}
}
