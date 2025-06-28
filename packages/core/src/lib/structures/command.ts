import { CoreClient } from '@/lib/structures/client.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type Permissions
} from 'discord-api-types/v10';
import {
	AutocompleteInteraction,
	BitField,
	ChatInputCommandInteraction,
	PermissionsBitField,
	type PermissionsString
} from 'discord.js';
import { type ChatInputData, type ChatInputOptions, type CommandParameter } from '@/types/command.js';
import { type Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export abstract class CoreCommand extends EventEmitter {
	protected client: CoreClient<true>;
	public unique?: string;
	public type: ApplicationCommandType.ChatInput;
	public name: string;
	public description: string;
	public options: CommandParameter[];
	public defaultMemberPermissions: Permissions | null;
	public nsfw: boolean;
	public integrationTypes: ApplicationIntegrationType[];
	public contexts: InteractionContextType[];
	public category: string;
	public enabled: boolean;
	public cooldown: number;
	public clientPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public userPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public unsafe: boolean;
	public guild: boolean;
	public owner: boolean;

	public constructor(client: CoreClient<true>, options: ChatInputOptions) {
		super();
		this.client = client;
		this.type = options.type;
		this.name = options.name;
		this.description = options.description;
		this.options = options.options ?? [];
		this.defaultMemberPermissions = options.defaultMemberPermissions ?? null;
		this.nsfw = options.nsfw ?? false;
		this.integrationTypes = options.integrationTypes ?? [ApplicationIntegrationType.GuildInstall];
		this.contexts = options.contexts ?? [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel
		];
		this.category = options.category ?? '';
		this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
		this.cooldown = options.cooldown ?? 3e3;
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.userPermissions = new PermissionsBitField(options.userPermissions).freeze();
		this.unsafe = options.unsafe ?? false;
		this.guild = options.guild ?? false;
		this.owner = options.owner ?? false;
	}

	public abstract execute(
		interaction: ChatInputCommandInteraction<'cached' | 'raw'>,
		...args: unknown[]
	): Awaitable<unknown>;

	public autocomplete(interaction: AutocompleteInteraction<'cached' | 'raw'>): Awaitable<unknown>;
	public autocomplete() {
		throw new Error(`The method 'autocomplete' has not been implemented in ${this.name}.`);
	}

	public toJSON(): ChatInputData {
		const data: ChatInputData = {
			type: this.type,
			name: this.name,
			description: this.description,
			options: this.options
		};

		if (typeof this.defaultMemberPermissions === 'string') {
			data.default_member_permissions = this.defaultMemberPermissions;
		}

		if (this.nsfw) {
			data.nsfw = this.nsfw;
		}

		if (typeof this.integrationTypes !== 'undefined') {
			data.integration_types = this.integrationTypes;
		}

		if (typeof this.contexts !== 'undefined') {
			data.contexts = this.contexts;
		}

		return data;
	}

	public override toString(): string {
		return this.name;
	}
}
