import type { TesseractClient } from '@/lib/structures/TesseractClient.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type Permissions
} from 'discord-api-types/v10';
import {
	AutocompleteInteraction,
	BitField,
	CommandInteraction,
	PermissionsBitField,
	type PermissionsString
} from 'discord.js';
import type { TesseractCommandData, TesseractCommandOptions, TesseractCommandParameter } from '@/types.js';
import type { Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export abstract class TesseractCommand extends EventEmitter {
	public client: TesseractClient<true>;
	public group?: string;
	public type: ApplicationCommandType;
	public name: string;
	public description: string;
	public options: TesseractCommandParameter[];
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

	public constructor(client: TesseractClient<true>, options: TesseractCommandOptions) {
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

	public abstract execute(interaction: CommandInteraction<'cached' | 'raw'>): Awaitable<unknown>;

	public autocomplete?(interaction: AutocompleteInteraction<'cached' | 'raw'>): Awaitable<unknown>;

	public toJSON(): TesseractCommandData {
		const data: TesseractCommandData = {
			type: this.type,
			name: this.name,
			description: this.description,
			default_member_permissions: this.defaultMemberPermissions,
			nsfw: this.nsfw,
			integration_types: this.integrationTypes,
			contexts: this.contexts
		};

		if (this.type === ApplicationCommandType.ChatInput) {
			data.options = this.options;
		}

		return data;
	}

	public override toString(): string {
		return this.name;
	}
}
