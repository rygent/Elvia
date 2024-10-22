#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

/**
 * @type {string}
 */
let script;

switch (command) {
	case 'register':
		script = await import('../scripts/register.js');
		script.exec();
		break;

	default:
		console.error(`command \`${command}\` not found`);
		process.exitCode = 1;
		break;
}
