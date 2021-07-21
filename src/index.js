require('dotenv').config();

const BaseClient = require('./Structures/BaseClient.js');
const config = require('./Structures/Configuration.js');

const client = new BaseClient(config);
client.start();
