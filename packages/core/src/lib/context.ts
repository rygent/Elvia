import { type CoreClient } from '@/lib/client.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type Locale,
	type PermissionFlagsBits,
	type RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import {
	PermissionsBitField,
	type BitField,
	type ContextMenuCommandInteraction,
	type PermissionsString
} from 'discord.js';
import { type Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export interface ContextMenuOptions
	extends Omit<
		RESTPostAPIContextMenuApplicationCommandsJSONBody,
		'default_permission' | 'description_localizations' | 'dm_permission' | 'handler'
	> {
	enabled?: boolean;
	cooldown?: number;
	client_permissions?: (typeof PermissionFlagsBits)[PermissionsString][];
	member_permissions?: (typeof PermissionFlagsBits)[PermissionsString][];
	guild_only?: boolean;
	owner_only?: boolean;
}

export type ContextMenuData = Omit<
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	'default_permission' | 'description_localizations' | 'dm_permission' | 'handler'
>;

export abstract class CoreContext extends EventEmitter {
	protected client: CoreClient<true>;
	public type: ApplicationCommandType.User | ApplicationCommandType.Message;
	public name: string;
	public nameLocalizations: Partial<Record<Locale, string | null>> | null;
	public defaultMemberPermissions: string | null;
	public nsfw: boolean;
	public integrationTypes: ApplicationIntegrationType[];
	public contexts: InteractionContextType[];
	public enabled: boolean;
	public cooldown: number;
	public clientPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public memberPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public guildOnly: boolean;
	public ownerOnly: boolean;

	public constructor(client: CoreClient<true>, options: ContextMenuOptions) {
		super();
		this.client = client;
		this.type = options.type;
		this.name = options.name;
		this.nameLocalizations = options.name_localizations ?? null;
		this.defaultMemberPermissions =
			options.default_member_permissions ??
			(options.member_permissions?.length
				? new PermissionsBitField(options.member_permissions).bitfield.toString()
				: null);
		this.nsfw = options.nsfw ?? false;
		this.integrationTypes = options.integration_types ?? [ApplicationIntegrationType.GuildInstall];
		this.contexts = options.contexts ?? [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel
		];
		this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
		this.cooldown = options.cooldown ?? 3e3;
		this.clientPermissions = new PermissionsBitField(options.client_permissions).freeze();
		this.memberPermissions = new PermissionsBitField(options.member_permissions).freeze();
		this.guildOnly = options.guild_only ?? false;
		this.ownerOnly = options.owner_only ?? false;
	}

	public abstract execute(
		interaction: ContextMenuCommandInteraction<'cached' | 'raw'>,
		...args: unknown[]
	): Awaitable<unknown>;

	public toJSON(): ContextMenuData {
		return {
			type: this.type,
			name: this.name,
			...(this.nameLocalizations && { name_localizations: this.nameLocalizations }),
			...(typeof this.defaultMemberPermissions === 'string' && {
				default_member_permissions: this.defaultMemberPermissions
			}),
			...(this.nsfw && { nsfw: this.nsfw }),
			...(typeof this.integrationTypes !== 'undefined' && { integration_types: this.integrationTypes }),
			...(typeof this.contexts !== 'undefined' && { contexts: this.contexts })
		};
	}

	public override toString(): string {
		return this.name;
	}
}
