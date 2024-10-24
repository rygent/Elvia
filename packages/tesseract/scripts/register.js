import { ApplicationCommandOptionType, ApplicationCommandType, Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { logger } from '@elvia/logger';
import { toTitleCase } from '@sapphire/utilities';
import { Command } from 'commander';
import { globby } from 'globby';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import 'dotenv/config';

const program = new Command();

program.option('-g, --global', 'register global commands');
program.option('-d, --dev', 'register developer commands');
program.option('-r, --reset', 'reset registered commands');

program.parse(process.argv);

const token = process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = process.env.DISCORD_APPLICATION_ID;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

const main = `${process.cwd()}/dist/index.js`;
const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

async function loadCommands(developer) {
	const commandData = [];

	if (!developer) {
		await globby(`${directory}commands/context/**/*.js`).then(async (commands) => {
			for (const commandFile of commands) {
				const { default: File } = await import(pathToFileURL(commandFile).toString());
				const command = new File();
				delete command.description;
				commandData.push(command.toJSON());
			}
		});
	}

	const patterns = developer
		? `${directory}commands/slash/?(developer)/**/*.js`
		: [`${directory}commands/slash/!(developer)/**/*.js`, `${directory}commands/slash/*.js`];

	await globby(patterns).then(async (commands) => {
		for (const commandFile of commands) {
			const { default: File } = await import(pathToFileURL(commandFile).toString());
			const command = new File();

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

				delete command.defaultMemberPermissions;
				delete command.nsfw;
				delete command.integrationTypes;
				delete command.contexts;

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
							description: `${toTitleCase(subCommandGroup)} commands group.`,
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

async function registerCommands() {
	const options = program.opts();
	if (!Object.keys(options).length) return void logger.info(program.helpInformation());

	const guildId = process.env.DEVELOPER_GUILD_ID;
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

export { registerCommands as exec };
