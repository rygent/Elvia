import { BitField, Client, PermissionsBitField, type ClientOptions, type PermissionsString } from 'discord.js';
import { Collection } from '@discordjs/collection';
import { CoreCommand } from '@/lib/command.js';
import { CoreContext } from '@/lib/context.js';
import { CoreEvent } from '@/lib/event.js';
import { CoreSettings } from '@/lib/settings.js';
import { isClass } from '@sapphire/utilities';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import path from 'node:path';
import fs from 'node:fs';

const jiti = createJiti(import.meta.url);

export interface CoreClientOptions extends ClientOptions {
	settings?: CoreSettings;
}

export class CoreClient<Ready extends boolean = boolean> extends Client<Ready> {
	public settings: CoreSettings;

	public commands: Collection<string, CoreCommand>;
	public contexts: Collection<string, CoreContext>;
	public events: Collection<string, CoreEvent>;

	public cooldowns: Collection<string, Collection<string, number>>;

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
		return `${path.dirname(process.argv[1]!) + path.sep}`.replace(/\\/g, '/');
	}

	protected async loadCommands(): Promise<void> {
		const commandFiles = await globby(`${this.directory}commands/slash/**/*.{js,ts}`);

		for (const file of commandFiles) {
			const { name } = path.parse(file);
			const Command = await jiti.import<CoreCommand>(file, { default: true });
			if (!isClass(Command)) throw new TypeError(`Command ${name} doesn't export a class.`);
			const command = new Command(this);
			if (!(command instanceof CoreCommand)) {
				throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
			}
			const relativePaths = path.relative(`${this.directory}commands/slash`, path.dirname(file));
			const [commandName, subCommandGroup] = relativePaths.split(path.sep);
			command.unique = [commandName, subCommandGroup, command.name].filter(Boolean).join(' ');
			this.commands.set(command.unique, command);
		}
	}

	protected async loadContextMenus(): Promise<void> {
		const contextFiles = await globby(`${this.directory}commands/context/**/*.{js,ts}`);

		for (const file of contextFiles) {
			const { name } = path.parse(file);
			const Context = await jiti.import<CoreContext>(file, { default: true });
			if (!isClass(Context)) throw new TypeError(`Context ${name} doesn't export a class.`);
			const context = new Context(this);
			if (!(context instanceof CoreContext)) {
				throw new TypeError(`Context ${name} doesn't belong in commands directory.`);
			}
			this.contexts.set(context.name, context);
		}
	}

	protected async loadEvents(): Promise<void> {
		const eventFiles = await globby(`${this.directory}events/**/*.{js,ts}`);

		for (const file of eventFiles) {
			const { name } = path.parse(file);
			const Event = await jiti.import<CoreEvent>(file, { default: true });
			if (!isClass(Event)) throw new TypeError(`Event ${name} doesn't export a class!`);
			const event = new Event(this);
			if (!(event instanceof CoreEvent)) {
				throw new TypeError(`Event ${name} doesn't belong in events directory.`);
			}
			event.emitter[event.type](event.name, (...args: unknown[]) => event.run(...args));
			this.events.set(event.name, event);
		}
	}

	public async start(token = this.settings.token) {
		await this.loadCommands();
		await this.loadContextMenus();
		await this.loadEvents();
		void super.login(token);
	}
}
