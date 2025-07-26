import { CoreClient } from '@/lib/structures/client.js';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type APIApplicationCommandOption,
	type Locale,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import {
	BitField,
	PermissionsBitField,
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	type PermissionsString
} from 'discord.js';
import { type Awaitable } from '@discordjs/util';
import { EventEmitter } from 'node:events';

export interface ChatInputOptions
	extends Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'default_permission' | 'dm_permission' | 'handler'> {
	category?: string;
	enabled?: boolean;
	cooldown?: number;
	client_permissions?: PermissionsString[];
	user_permissions?: PermissionsString[];
	guild?: boolean;
	owner?: boolean;
}

export type ChatInputData = Omit<
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	'default_permission' | 'dm_permission' | 'handler'
>;

export abstract class CoreCommand extends EventEmitter {
	protected client: CoreClient<true>;
	public unique?: string;
	public type: ApplicationCommandType.ChatInput | undefined;
	public name: string;
	public nameLocalizations: Partial<Record<Locale, string | null>> | null;
	public description: string;
	public descriptionLocalizations: Partial<Record<Locale, string | null>> | null;
	public options: APIApplicationCommandOption[];
	public defaultMemberPermissions: string | null;
	public nsfw: boolean;
	public integrationTypes: ApplicationIntegrationType[];
	public contexts: InteractionContextType[];
	public category: string;
	public enabled: boolean;
	public cooldown: number;
	public clientPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public userPermissions: Readonly<BitField<PermissionsString, bigint>>;
	public guild: boolean;
	public owner: boolean;

	public constructor(client: CoreClient<true>, options: ChatInputOptions) {
		super();
		this.client = client;
		this.type = options.type ?? ApplicationCommandType.ChatInput;
		this.name = options.name;
		this.nameLocalizations = options.name_localizations ?? null;
		this.description = options.description;
		this.descriptionLocalizations = options.description_localizations ?? null;
		this.options = options.options ?? [];
		this.defaultMemberPermissions = options.default_member_permissions ?? null;
		this.nsfw = options.nsfw ?? false;
		this.integrationTypes = options.integration_types ?? [ApplicationIntegrationType.GuildInstall];
		this.contexts = options.contexts ?? [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel
		];
		this.category = options.category ?? '';
		this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
		this.cooldown = options.cooldown ?? 3e3;
		this.clientPermissions = new PermissionsBitField(options.client_permissions).freeze();
		this.userPermissions = new PermissionsBitField(options.user_permissions).freeze();
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
		const data = {
			type: this.type,
			name: this.name,
			...(this.nameLocalizations && { name_localizations: this.nameLocalizations }),
			description: this.description,
			...(this.descriptionLocalizations && { description_localizations: this.descriptionLocalizations }),
			...(typeof this.options !== 'undefined' && { options: this.options }),
			...(typeof this.defaultMemberPermissions === 'string' && {
				default_member_permissions: this.defaultMemberPermissions
			}),
			...(this.nsfw && { nsfw: this.nsfw }),
			...(typeof this.integrationTypes !== 'undefined' && { integration_types: this.integrationTypes }),
			...(typeof this.contexts !== 'undefined' && { contexts: this.contexts })
		};

		return data as ChatInputData;
	}

	public override toString(): string {
		return this.name;
	}
}
