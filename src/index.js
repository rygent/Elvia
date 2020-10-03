require('dotenv').config();

const EvoraClient = require('./structures/EvoraClient.js');
const config = require('./structures/Configuration.js');

const client = new EvoraClient(config);

client.start();
