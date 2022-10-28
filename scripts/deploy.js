import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import { SnowflakeRegex, TokenRegex } from '@sapphire/discord-utilities';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { promisify } from 'node:util';
import { Logger } from '@rygent/logger';
import path from 'node:path';
import glob from 'glob';
import inquirer from 'inquirer';
import 'dotenv/config';
const globber = promisify(glob);
const logger = new Logger();

export async function deploy() {
	const main = fileURLToPath(new URL('../src/index.js', import.meta.url));
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [];
	await globber(`${directory}Interactions/?(Context|Slash)/!(Developer)/**/*.js`).then(async (interactions) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			commands.push(interaction);
		}
	});

	const devCommands = [];
	await globber(`${directory}Interactions/?(Context|Slash)/?(Developer)/**/*.js`).then(async (interactions) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			devCommands.push(interaction);
		}
	});

	let { clientId, guildId, token } = await inquirer.prompt([{
		type: 'input',
		name: 'clientId',
		message: 'Input here the client id:',
		when: () => !process.env.CLIENT_ID,
		validate: (value) => {
			if (SnowflakeRegex.test(value)) return true;
			else return 'Please input a valid client id!';
		}
	}, {
		type: 'input',
		name: 'guildId',
		message: 'Input here the guild id:',
		when: () => !process.env.GUILD_ID,
		validate: (value) => {
			if (SnowflakeRegex.test(value)) return true;
			else return 'Please input a valid guild id!';
		}
	}, {
		type: 'password',
		name: 'token',
		message: 'Input here the bot token:',
		mask: '*',
		when: () => !process.env.DISCORD_TOKEN,
		validate: (value) => {
			if (TokenRegex.test(value)) return true;
			else return 'Please input a valid token!';
		}
	}]);

	if (!clientId) clientId = process.env.CLIENT_ID;
	if (!guildId) guildId = process.env.GUILD_ID;
	if (!token) token = process.env.DISCORD_TOKEN;

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		logger.debug('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [...devCommands] });
		await rest.put(Routes.applicationCommands(clientId), { body: [...commands] });

		logger.debug('Successfully reloaded application (/) commands.');
	} catch (error) {
		logger.error(`${error.name}: ${error.message}`, error, false);
	}
}

await deploy();
