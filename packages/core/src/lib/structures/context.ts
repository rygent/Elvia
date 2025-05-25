import { CoreClient } from '@/lib/structures/client.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type Permissions
} from 'discord-api-types/v10';
import { BitField, type ContextMenuCommandInteraction, PermissionsBitField, type PermissionsString } from 'discord.js';
import { type Awaitable } from '@discordjs/util';
import { type ContextMenuData, type ContextMenuOptions } from '@/types/command.js';
import { EventEmitter } from 'node:events';

export abstract class CoreContext extends EventEmitter {
	protected client: CoreClient<true>;
	public type: ApplicationCommandType.Message | ApplicationCommandType.User;
	public name: string;
	public defaultMemberPermissions: Permissions | null;
	public nsfw: boolean;
	public integrationTypes: ApplicationIntegrationType[];
	public contexts: InteractionContextType[];
	public enabled: boolean;
	public clientPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public userPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public unsafe: boolean;
	public guild: boolean;
	public owner: boolean;

	public constructor(client: CoreClient<true>, options: ContextMenuOptions) {
		super();
		this.client = client;
		this.type = options.type;
		this.name = options.name;
		this.defaultMemberPermissions = options.defaultMemberPermissions ?? null;
		this.nsfw = options.nsfw ?? false;
		this.integrationTypes = options.integrationTypes ?? [ApplicationIntegrationType.GuildInstall];
		this.contexts = options.contexts ?? [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel
		];
		this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.userPermissions = new PermissionsBitField(options.userPermissions).freeze();
		this.unsafe = options.unsafe ?? false;
		this.guild = options.guild ?? false;
		this.owner = options.owner ?? false;
	}

	public abstract execute(
		interaction: ContextMenuCommandInteraction<'cached' | 'raw'>,
		...args: unknown[]
	): Awaitable<unknown>;

	public toJSON(): ContextMenuData {
		const data: ContextMenuData = {
			type: this.type,
			name: this.name
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
