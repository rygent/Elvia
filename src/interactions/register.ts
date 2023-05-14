import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Command } from 'commander';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { globby } from 'globby';
import Logger from '../lib/modules/Logger.js';
import path from 'node:path';
import moment from 'moment-timezone';
import 'dotenv/config';

const logger = new Logger();
const program = new Command();

moment.tz.setDefault(process.env.TIMEZONE);

program.option('-g, --global', 'register global commands');
program.option('-d, --dev', 'register developer commands');
program.option('-r, --reset', 'reset registered commands');

program.parse(process.argv);

const token = process.env.DISCORD_TOKEN as string;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = process.env.DISCORD_APPLICATION_ID as string;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function loadCommands(developer: boolean): Promise<object[]> {
	const main = fileURLToPath(import.meta.url);
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [] as object[];
	const routes = developer ? '?(developer)' : '!(developer)';

	await globby(`${directory}?(context|slash)/${routes}/**/*.js`).then(async (interactions: string[]) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile).toString());
			commands.push(interaction);
		}
	});

	return commands;
}

async function registerCommands(): Promise<void> {
	const options = program.opts();
	if (!Object.keys(options).length) return void logger.info(program.helpInformation());

	const guildId = process.env.DISCORD_GUILD_ID as string;
	if (!guildId && options.dev) {
		throw new Error('The DISCORD_GUILD_ID environment variable is required.');
	}

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		logger.debug('Started refreshing application (/) commands.');

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

		logger.debug('Successfully reloaded application (/) commands.');
	} catch (e: unknown) {
		logger.error(`${(e as Error).name}: ${(e as Error).message}`, e as Error, false);
	}
}

void registerCommands();
