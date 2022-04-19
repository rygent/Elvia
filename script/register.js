const { promisify } = require('node:util');
const glob = promisify(require('glob'));
const inquirer = require('inquirer');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require('dotenv/config');

(async () => {
	const commands = [];
	await glob('src/Interactions/**/*.js').then(interactions => {
		for (const interactionFiles of interactions) {
			const interaction = require(`../${interactionFiles}`);
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
				await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [...commands.values()] });
				break;
			case 'global':
				await rest.put(Routes.applicationCommands(clientId), { body: [...commands.values()] });
				break;
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
