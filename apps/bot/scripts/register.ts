import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	Routes,
	type APIApplicationCommandBasicOption,
	type RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v10';
import { CoreCommand, CoreContext } from '@elvia/core';
import { REST } from '@discordjs/rest';
import { titleCase } from '@elvia/utils';
import { logger } from '@elvia/logger';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { env } from '@/env.js';
import path from 'node:path';
import dotenv from 'dotenv';

// eslint-disable-next-line import-x/no-named-as-default-member
dotenv.config({ override: true, quiet: true });

const jiti = createJiti(import.meta.url);

const main = `${process.cwd()}/src/index.ts`;
const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

async function loadCommands(patterns: string | readonly string[]) {
	const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

	const commandFiles = await globby(patterns);
	for (const commandFile of commandFiles) {
		const Command = await jiti.import<any>(commandFile, { default: true });
		const command = new Command();

		if (command instanceof CoreContext) {
			commandData.push(command.toJSON());
			continue;
		}

		if (command instanceof CoreCommand) {
			mergeCommands(commandData, command, commandFile);
		}
	}

	return commandData;
}

function mergeCommands(
	commandData: RESTPostAPIApplicationCommandsJSONBody[],
	command: CoreCommand,
	commandFile: string
) {
	const relativePath = path.relative(`${directory}commands/slash`, path.dirname(commandFile));
	const [commandName, subGroup] = relativePath.split(path.sep);

	if (commandName) {
		let parentCommand = commandData.find((cmd) => cmd.name === commandName);
		if (!parentCommand) {
			parentCommand = {
				...command.toJSON(),
				type: ApplicationCommandType.ChatInput,
				name: commandName,
				description: `Use ${commandName} commands.`,
				options: []
			};

			commandData.push(parentCommand);
		}

		const subData = command.toJSON();

		if (subGroup) {
			let groupCommand = parentCommand.options?.find((opt) => opt.name === subGroup);
			if (!groupCommand) {
				groupCommand = {
					type: ApplicationCommandOptionType.SubcommandGroup,
					name: subGroup,
					description: `${titleCase(subGroup)} commands group.`,
					options: []
				};

				parentCommand.options?.push(groupCommand);
			}

			if (groupCommand.type === ApplicationCommandOptionType.SubcommandGroup) {
				groupCommand.options?.push({
					type: ApplicationCommandOptionType.Subcommand,
					name: subData.name,
					description: subData.description,
					options: subData.options as APIApplicationCommandBasicOption[]
				});
			}
		} else {
			parentCommand.options?.push({
				type: ApplicationCommandOptionType.Subcommand,
				name: subData.name,
				description: subData.description,
				options: subData.options as APIApplicationCommandBasicOption[]
			});
		}
	} else {
		commandData.push(command.toJSON());
	}
}

async function registerCommands() {
	const token = env.BOT_TOKEN;
	if (!token) {
		throw new Error('The BOT_TOKEN environment variable is required.');
	}

	const applicationId = env.BOT_ID;
	if (!applicationId) {
		throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
	}

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		logger.info('Started refreshing application (/) commands.');

		const guildId = env.DEVELOPER_GUILD_ID;
		if (guildId) {
			const devCommands = await loadCommands(`${directory}commands/slash/?(developer)/**/*.ts`);

			await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
				body: devCommands
			});
		}

		const globalCommands = await loadCommands([
			`${directory}commands/context/**/*.ts`,
			`${directory}commands/slash/!(developer)/**/*.ts`,
			`${directory}commands/slash/*.ts`
		]);

		await rest.put(Routes.applicationCommands(applicationId), {
			body: globalCommands
		});

		logger.info('Successfully reloaded application (/) commands.');
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`${error.name}: ${error.message}`, { error, webhook: false });
		}
	}
}

void registerCommands();
