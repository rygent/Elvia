const mongoose = require('mongoose');

module.exports = {
	init: () => {
		// eslint-disable-next-line no-process-env
		mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

		mongoose.connection.on('connected', () => {
			console.log('Connected to the MongoDB database.');
		});

		mongoose.connection.on('err', err => {
			console.error(`Unable to connect to the MongoDB database. Error:\n${err}`);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB database connection is disconnected');
		});
	}
};
