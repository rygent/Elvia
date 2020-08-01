require('dotenv').config();

const KirasakaClient = require('./structures/KirasakaClient.js');
const config = require('./structures/Configuration.js');

const client = new KirasakaClient(config);

client.start();
