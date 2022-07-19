import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { promisify } from 'node:util';
import path from 'node:path';
import glob from 'glob';
import inquirer from 'inquirer';
import 'dotenv/config';
const globber = promisify(glob);

export async function deploy() {
	const main = fileURLToPath(new URL('../src/index.js', import.meta.url));
	const directory = `${path.dirname(main) + path.sep}`.replace(/\\/g, '/');

	const commands = [];
	await globber(`${directory}Interactions/**/*.js`).then(async (interactions) => {
		for (const interactionFile of interactions) {
			const { default: interaction } = await import(pathToFileURL(interactionFile));
			commands.push(interaction);
		}
	});

	// eslint-disable-next-line prefer-const
	let { type, clientId, guildId, token } = await inquirer.prompt([{
		type: 'rawlist',
		name: 'type',
		message: 'Select register type:',
		choices: [{
			name: 'Guild',
			value: 'guild'
		}, {
			name: 'Global',
			value: 'global'
		}]
	}, {
		type: 'input',
		name: 'clientId',
		message: 'Enter the client id:',
		default: process.env.CLIENT_ID,
		validate: (value) => {
			if (!value) return 'Please enter a client id';
			return true;
		}
	}, {
		type: 'input',
		name: 'guildId',
		message: 'Enter the guild id:',
		when: (answer) => answer.type === 'guild',
		validate: (value) => {
			if (!value) return 'Please enter a guild id';
			return true;
		}
	}, {
		type: 'password',
		name: 'token',
		message: 'Enter the bot token:',
		mask: '*',
		when: () => !process.env.DISCORD_TOKEN
	}]);

	if (!token) token = process.env.DISCORD_TOKEN;
	const rest = new REST({ version: '10' }).setToken(token);

	try {
		console.log('Started refreshing application (/) commands.');

		switch (type) {
			case 'guild':
				await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [...commands] });
				break;
			case 'global':
				await rest.put(Routes.applicationCommands(clientId), { body: [...commands] });
				break;
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}

await deploy();
