const database = require('mongoose');
const chalk = require('chalk');

module.exports = class ElainaDatabase {

	async loadDatabase() { // eslint-disable-next-line no-process-env
		database.connect(process.env.MONGO_URI, {
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
			process.stdout.write(`[${chalk.blueBright('INFO')}] MongoDB connection is disconnected\n`);
		});
	}

};
