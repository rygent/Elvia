require('dotenv').config();

const BaseClient = require('./Structures/BaseClient.js');
const Configuration = require('./Utils/Configuration.js');

const client = new BaseClient(Configuration);
client.start();
