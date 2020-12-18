require('dotenv').config();

const ElainaClient = require('./Structures/ElainaClient.js');
const config = require('./Structures/Configuration.js');

const client = new ElainaClient(config);
client.start();
