import { BitField, Client, PermissionsBitField, type PermissionsString } from 'discord.js';
import { Collection } from '@discordjs/collection';
import { CoreCommand } from '@/lib/structures/command.js';
import { CoreContext } from '@/lib/structures/context.js';
import { CoreEvent } from '@/lib/structures/event.js';
import { CoreSettings } from '@/lib/structures/settings.js';
import { type CoreClientOptions } from '@/types/client.js';
import { isClass } from '@sapphire/utilities';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const jiti = createJiti(import.meta.url);

export class CoreClient<Ready extends boolean = boolean> extends Client<Ready> {
	public settings: CoreSettings;

	public commands: Collection<string, CoreCommand>;
	public contexts: Collection<string, CoreContext>;
	public events: Collection<string, CoreEvent>;

	public cooldowns: Collection<string, Collection<string, number>>;

	private readonly root: string;
	public version: string;
	public defaultPermissions: Readonly<BitField<PermissionsString, bigint>>;

	public constructor(options: CoreClientOptions) {
		super(options);
		this.settings = options.settings instanceof CoreSettings ? options.settings : new CoreSettings();
		this.validate();

		this.commands = new Collection();
		this.contexts = new Collection();
		this.events = new Collection();

		this.cooldowns = new Collection();

		this.root = options.root ? options.root : fileURLToPath(import.meta.url);
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

	private get directory(): string {
		return `${path.dirname(this.root) + path.sep}`.replace(/\\/g, '/');
	}

	protected async loadCommands(): Promise<void> {
		return globby(`${this.directory}commands/slash/**/*.{js,ts}`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const File = await jiti.import<CoreCommand>(commandFile, { default: true });
				if (!isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this);
				if (!(command instanceof CoreCommand)) {
					throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				}
				const [commandName, subCommandGroup] = path
					.relative(`${this.directory}commands/slash`, path.dirname(commandFile))
					.split(path.sep);
				const unique = [
					...(commandName?.length ? [commandName] : []),
					...(subCommandGroup ? [subCommandGroup] : []),
					command.name
				].join(' ');
				command.unique = unique;
				this.commands.set(command.unique, command);
			}
		});
	}

	protected async loadContextMenus(): Promise<void> {
		return globby(`${this.directory}commands/context/**/*.{js,ts}`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const File = await jiti.import<CoreContext>(commandFile, { default: true });
				if (!isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this);
				if (!(command instanceof CoreContext)) {
					throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				}
				this.contexts.set(command.name, command);
			}
		});
	}

	protected async loadEvents(): Promise<void> {
		return globby(`${this.directory}events/**/*.{js,ts}`).then(async (events: string[]) => {
			for (const eventFile of events) {
				const { name } = path.parse(eventFile);
				const File = await jiti.import<CoreEvent>(eventFile, { default: true });
				if (!isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this);
				if (!(event instanceof CoreEvent)) {
					throw new TypeError(`Event ${name} doesn't belong in events directory.`);
				}
				event.emitter[event.type](event.name, (...args: unknown[]) => event.run(...args));
				this.events.set(event.name, event);
			}
		});
	}

	public async start(token = this.settings.token) {
		await this.loadCommands();
		await this.loadContextMenus();
		await this.loadEvents();
		void super.login(token);
	}
}
