import { BitField, Client, PermissionsBitField, type ClientOptions, type PermissionsString } from 'discord.js';
import { Collection } from '@discordjs/collection';
import { BaseCommand } from '@/structures/command.js';
import { BaseListener } from '@/structures/listener.js';
import { BaseSettings } from '@/structures/settings.js';
import { globby } from 'globby';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export class BaseClient<Ready extends boolean = boolean> extends Client<Ready> {
	public settings: BaseSettings;

	public commands: BaseCommand[];
	public listener: BaseListener[];

	public cooldowns: Collection<string, Collection<string, number>>;

	public version: string;
	public defaultPermissions: Readonly<BitField<PermissionsString, bigint>>;

	public constructor(options: ClientOptions) {
		super(options);
		this.settings = new BaseSettings();
		this.validate();

		// eslint-disable-next-line @typescript-eslint/no-array-constructor
		this.commands = new Array();
		// eslint-disable-next-line @typescript-eslint/no-array-constructor
		this.listener = new Array();

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

	private isClass(input: unknown): boolean {
		return typeof input === 'function' && typeof input.prototype === 'object' && input.toString().startsWith('class');
	}

	private get directory(): string {
		const main = `${process.cwd()}/dist/index.js`;
		return `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');
	}

	private async loadCommands(): Promise<void> {
		return globby(`${this.directory}commands/**/*.js`).then(async (commands: string[]) => {
			for (const commandFile of commands) {
				const { name } = path.parse(commandFile);
				const { default: File } = await import(pathToFileURL(commandFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this);
				if (!(command instanceof BaseCommand)) {
					throw new TypeError(`Command ${name} doesn't belong in commands directory.`);
				}
				const [commandName, subCommandGroup] = path
					.relative(`${this.directory}commands/slash`, path.dirname(commandFile))
					.split(path.sep);
				command.group = subCommandGroup ? `${commandName}.${subCommandGroup}` : (commandName ?? undefined);
				this.commands.push(command);
			}
		});
	}

	private async loadListeners(): Promise<void> {
		return globby(`${this.directory}listeners/**/*.js`).then(async (listeners: string[]) => {
			for (const listenerFile of listeners) {
				const { name } = path.parse(listenerFile);
				const { default: File } = await import(pathToFileURL(listenerFile).toString());
				if (!this.isClass(File)) throw new TypeError(`Listener ${name} doesn't export a class!`);
				const listener = new File(this);
				if (!(listener instanceof BaseListener)) {
					throw new TypeError(`Listener ${name} doesn't belong in listeners directory.`);
				}
				this.listener.push(listener);
				listener.emitter[listener.type](listener.name, (...args: unknown[]) => listener.run(...args));
			}
		});
	}

	public async start(token = this.settings.token) {
		await this.loadCommands();
		await this.loadListeners();
		void super.login(token as string);
	}
}
