import {
	ApplicationCommandType,
	PermissionFlagsBits,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	type RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import {
	type ChatInputCommandInteraction,
	type ContextMenuCommandInteraction,
	type PermissionsString
} from 'discord.js';

interface BaseCommandOptions {
	category?: string;
	enabled?: boolean;
	cooldown?: number;
	client_permissions?: (typeof PermissionFlagsBits)[PermissionsString][];
	member_permissions?: (typeof PermissionFlagsBits)[PermissionsString][];
	guild_only?: boolean;
	owner_only?: boolean;
}

export interface ChatInputCommandData<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
> extends Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'default_permission' | 'dm_permission' | 'handler'> {
	type?: Extract<CommandType, ApplicationCommandType.ChatInput>;
}

export interface ChatInputCommandOptions<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
>
	extends ChatInputCommandData<CommandType>, BaseCommandOptions {}

export interface ContextMenuCommandData<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
> extends Omit<
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	'default_permission' | 'description_localizations' | 'dm_permission' | 'handler' | 'options'
> {
	type: Extract<CommandType, ApplicationCommandType.User | ApplicationCommandType.Message>;
}

export interface ContextMenuCommandOptions<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
>
	extends ContextMenuCommandData<CommandType>, BaseCommandOptions {}

export type CommandData<CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>> =
	| ChatInputCommandData<Extract<CommandType, ApplicationCommandType.ChatInput>>
	| ContextMenuCommandData<Extract<CommandType, ApplicationCommandType.User | ApplicationCommandType.Message>>;

export type CommandOptions<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
> =
	| ChatInputCommandOptions<Extract<CommandType, ApplicationCommandType.ChatInput>>
	| ContextMenuCommandOptions<Extract<CommandType, ApplicationCommandType.User | ApplicationCommandType.Message>>;

export type CommandInteraction<
	CommandType extends Exclude<ApplicationCommandType, ApplicationCommandType.PrimaryEntryPoint>
> = CommandType extends ApplicationCommandType.ChatInput
	? ChatInputCommandInteraction
	: CommandType extends ApplicationCommandType.User | ApplicationCommandType.Message
		? ContextMenuCommandInteraction
		: never;
