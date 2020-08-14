const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	init: () => {
		// eslint-disable-next-line no-process-env
		mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

		mongoose.connection.on('connected', () => {
			process.stdout.write(`[${chalk.greenBright('BOOT')}] Connected to MongoDB!\n`);
		});

		mongoose.connection.on('err', err => {
			process.stdout.write(`[${chalk.redBright('ERROR')}] Unable to connect to the MongoDB database. Error:\n${err}\n`);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB database connection is disconnected');
		});
	}
};
