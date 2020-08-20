require('dotenv').config();

const RivenClient = require('./structures/RivenClient.js');
const config = require('./structures/Configuration.js');

const client = new RivenClient(config);

client.start();
