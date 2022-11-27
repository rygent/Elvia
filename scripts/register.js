import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Logger } from '@rygent/logger';
import { Command } from 'commander';
import { globby } from 'globby';
import path from 'node:path';
import 'dotenv/config';

const logger = new Logger();
const program = new Command();

program.option('-g, --global', 'register global commands');
program.option('-d, --dev', 'register developer commands');

program.parse(process.argv);

const token = process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

const applicationId = process.env.DISCORD_APPLICATION_ID;
if (!applicationId) {
	throw new Error('The DISCORD_APPLICATION_ID environment variable is required.');
}

async function loadCommands(developer = false) {
	const main = fileURLToPath(new URL('../src/index.js', import.meta.url));
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [];
	const routes = developer ? '?(Developer)' : '!(Developer)';

	await globby(`${directory}Interactions/?(Context|Slash)/${routes}/**/*.js`).then(async (interactions) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			commands.push(interaction);
		}
	});

	return commands;
}

async function registerCommands(developer = false) {
	const guildId = process.env.DISCORD_GUILD_ID;
	if (!guildId && developer) {
		throw new Error('The DISCORD_GUILD_ID environment variable is required.');
	}

	const commands = await loadCommands(developer);
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		logger.debug('Started refreshing application (/) commands.');

		switch (developer) {
			case true:
				await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
				break;
			case false:
				await rest.put(Routes.applicationCommands(applicationId), { body: commands });
				break;
		}

		logger.debug('Successfully reloaded application (/) commands.');
	} catch (error) {
		logger.error(`${error.name}: ${error.message}`, error, false);
	}
}

const options = program.opts();
if (!options.global && !options.dev) console.log(program.helpInformation());
if (options.global) await registerCommands(false);
if (options.dev) await registerCommands(true);
