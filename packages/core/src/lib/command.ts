import { type CoreClient } from '@/lib/client.js';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { PermissionsBitField, type AutocompleteInteraction, type BitField, type PermissionsString } from 'discord.js';
import { type CommandData, type CommandInteraction, type CommandOptions } from '@/types/command.js';
import { type Awaitable } from '@discordjs/util';
import { omitKeysFromObject } from '@sapphire/utilities';
import { EventEmitter } from 'node:events';

export abstract class CoreCommand<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
> extends EventEmitter {
	protected client: CoreClient<true>;
	public id?: string;
	public data: CommandData<CommandType>;
	public category?: string;
	public enabled: boolean;
	public cooldown: number;
	public client_permissions: Readonly<BitField<PermissionsString, bigint>>;
	public member_permissions: Readonly<BitField<PermissionsString, bigint>>;
	public guild_only: boolean;
	public owner_only: boolean;

	public constructor(client: CoreClient<true>, options: CommandOptions<CommandType>) {
		super();
		this.client = client;
		this.data = omitKeysFromObject(
			structuredClone(options),
			'category',
			'client_permissions',
			'cooldown',
			'enabled',
			'guild_only',
			'member_permissions',
			'owner_only'
		) as CommandData<CommandType>;
		this.data.default_member_permissions =
			options.default_member_permissions ??
			(options.member_permissions?.length
				? new PermissionsBitField(options.member_permissions).bitfield.toString()
				: null);
		this.data.integration_types = options.integration_types ?? [ApplicationIntegrationType.GuildInstall];
		this.data.contexts = options.contexts ?? [
			InteractionContextType.Guild,
			InteractionContextType.BotDM,
			InteractionContextType.PrivateChannel
		];
		this.category = options.category;
		this.enabled = typeof options.enabled === 'boolean' ? options.enabled : true;
		this.cooldown = options.cooldown ?? 3e3;
		this.client_permissions = new PermissionsBitField(options.client_permissions).freeze();
		this.member_permissions = new PermissionsBitField(options.member_permissions).freeze();
		this.guild_only = options.guild_only ?? false;
		this.owner_only = options.owner_only ?? false;
	}

	public abstract execute(interaction: CommandInteraction<CommandType>, ...args: unknown[]): Awaitable<unknown>;

	public autocomplete(
		interaction: AutocompleteInteraction
	): CommandType extends ApplicationCommandType.ChatInput ? Awaitable<unknown> : never;
	public autocomplete(): never {
		if (this.data.type !== ApplicationCommandType.ChatInput) {
			throw new Error(`Autocomplete is only available for slash commands. Attempted on ${this.data.name}.`);
		}

		throw new Error(`The method 'autocomplete' has not been implemented in ${this.data.name}.`);
	}

	public toJSON(): CommandData<CommandType> {
		const data = { ...structuredClone(this.data) };

		for (const key of Object.keys(data)) {
			const k = key as keyof CommandData<CommandType>;
			// eslint-disable-next-line no-eq-null
			if (data[k] == null) {
				Reflect.deleteProperty(data, k);
			}
		}

		return data as CommandData<CommandType>;
	}

	public override toString() {
		return this.data.name;
	}
}
