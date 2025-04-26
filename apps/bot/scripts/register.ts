import { ApplicationCommandOptionType, ApplicationCommandType, Routes } from 'discord-api-types/v10';
import { CoreCommand, CoreContext, type ChatInputData, type CommandData, type ContextMenuData } from '@elvia/core';
import { REST } from '@discordjs/rest';
import { titleCase } from '@elvia/utils';
import { logger } from '@elvia/logger';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { env } from '@/env.js';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const jiti = createJiti(import.meta.url);

const token = env.BOT_TOKEN;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = env.DISCORD_APPLICATION_ID;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

const main = `${process.cwd()}/src/index.ts`;
const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

async function loadCommands(patterns: string | readonly string[]) {
	const commandData: CommandData[] = [];

	await globby(patterns).then(async (commands) => {
		for (const commandFile of commands) {
			const File = await jiti.import<any>(commandFile, { default: true });
			const command = new File();

			if (command instanceof CoreContext) {
				(commandData as ContextMenuData[]).push(command.toJSON());
			}

			if (command instanceof CoreCommand) {
				const [commandName, subCommandGroup] = path
					.relative(`${directory}commands/slash`, path.dirname(commandFile))
					.split(path.sep);

				if (commandName) {
					if (!(commandData as ChatInputData[]).some((cmd) => cmd.name === commandName)) {
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

					const subCommand = (commandData as ChatInputData[]).find((cmd) => cmd.name === commandName);
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
		}
	});

	return commandData;
}

async function registerCommands() {
	const rest = new REST({ version: '10' }).setToken(token as string);

	try {
		logger.info('Started refreshing application (/) commands.');

		const guildId = env.DEVELOPER_GUILD_ID;
		if (guildId) {
			const commands = await loadCommands(`${directory}commands/slash/?(developer)/**/*.ts`);

			await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
				body: commands
			});
		}

		const commands = await loadCommands([
			`${directory}commands/context/**/*.ts`,
			`${directory}commands/slash/!(developer)/**/*.ts`,
			`${directory}commands/slash/*.ts`
		]);

		await rest.put(Routes.applicationCommands(applicationId), {
			body: commands
		});

		logger.info('Successfully reloaded application (/) commands.');
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`${error.name}: ${error.message}`, { error, webhook: false });
		}
	}
}

void registerCommands();
