const { Access } = require('./Configuration.js');
const database = require('mongoose');
const chalk = require('chalk');

module.exports = class ClientDatabase {

	async loadDatabase() {
		database.connect(Access.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		database.connection.on('connected', () => {
			process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to MongoDB!\n`);
		});

		database.connection.on('err', err => {
			process.stdout.write(`[${chalk.redBright('ERROR')}] Unable to connect to the MongoDB. Error:\n${err}\n`);
		});

		database.connection.on('disconnected', () => {
			process.stdout.write(`[${chalk.grey('INFO')}] MongoDB connection is disconnected\n`);
		});
	}

};
