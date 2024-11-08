import { ApplicationCommandOptionType, ApplicationCommandType, Routes } from 'discord-api-types/v10';
import { Command } from '@/lib/structures/command.js';
import { REST } from '@discordjs/rest';
import type { CommandData } from '@/types/types.js';
import { titleCase } from '@/lib/utils/functions.js';
import { logger } from '@elvia/logger';
import { Command as Commander } from 'commander';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { env } from '@/env.js';
import path from 'node:path';

const jiti = createJiti(import.meta.url);
const program = new Commander();

program.option('-g, --global', 'register global commands');
program.option('-d, --dev', 'register developer commands');
program.option('-r, --reset', 'reset registered commands');

program.parse(process.argv);

const token = env.DISCORD_TOKEN;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = env.DISCORD_APPLICATION_ID;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

const main = `${process.cwd()}/src/index.ts`;
const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

async function loadCommands(developer: boolean) {
	const commandData: CommandData[] = [];

	if (!developer) {
		await globby(`${directory}commands/context/**/*.ts`).then(async (commands) => {
			for (const commandFile of commands) {
				const File: any = await jiti.import(commandFile, { default: true });
				const command: Command = new File();
				commandData.push(command.toJSON());
			}
		});
	}

	const patterns = developer
		? `${directory}commands/slash/?(developer)/**/*.ts`
		: [`${directory}commands/slash/!(developer)/**/*.ts`, `${directory}commands/slash/*.ts`];

	await globby(patterns).then(async (commands) => {
		for (const commandFile of commands) {
			const File: any = await jiti.import(commandFile, { default: true });
			const command: Command = new File();

			const [commandName, subCommandGroup] = path
				.relative(`${directory}commands/slash`, path.dirname(commandFile))
				.split(path.sep);

			if (commandName) {
				if (!commandData.some((cmd) => cmd.name === commandName)) {
					commandData.push({
						...command.toJSON(),
						type: ApplicationCommandType.ChatInput,
						name: commandName,
						description: `Use ${commandName} commands.`,
						options: []
					});
				}

				Reflect.deleteProperty(command, 'defaultMemberPermissions');
				Reflect.deleteProperty(command, 'nsfw');
				Reflect.deleteProperty(command, 'integrationTypes');
				Reflect.deleteProperty(command, 'contexts');

				const data = {
					...command.toJSON(),
					type: ApplicationCommandOptionType.Subcommand
				};

				const subCommand = commandData.find((cmd) => cmd.name === commandName);
				if (subCommandGroup) {
					if (!subCommand?.options?.some((cmd) => cmd.name === subCommandGroup)) {
						subCommand?.options?.push({
							type: ApplicationCommandOptionType.SubcommandGroup,
							name: subCommandGroup,
							description: `${titleCase(subCommandGroup)} commands group.`,
							options: []
						});
					}

					subCommand?.options?.find((cmd) => cmd.name === subCommandGroup)?.options?.push(data);
				} else {
					subCommand?.options?.push(data);
				}
			} else {
				commandData.push(command.toJSON());
			}
		}
	});

	return commandData;
}

async function execute() {
	const options = program.opts();
	if (!Object.keys(options).length) return void logger.info(program.helpInformation());

	const guildId = env.DEVELOPER_GUILD_ID;
	if (!guildId && options.dev) {
		throw new Error('The DEVELOPER_GUILD_ID environment variable is required.');
	}

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		logger.info('Started refreshing application (/) commands.');

		if (options.reset) {
			await rest.put(Routes.applicationCommands(applicationId), { body: [] });
			if (guildId) {
				await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: [] });
			}
		}

		if (options.global) {
			const commands = await loadCommands(false);
			await rest.put(Routes.applicationCommands(applicationId), { body: commands });
		}

		if (options.dev) {
			const commands = await loadCommands(true);
			await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
		}

		logger.info('Successfully reloaded application (/) commands.');
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`${error.name}: ${error.message}`, { error, webhook: false });
		}
	}
}

void execute();
