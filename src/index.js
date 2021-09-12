require('dotenv').config();

const BaseClient = require('./Structures/BaseClient.js');
const Setting = require('./Utils/Setting.js');

const client = new BaseClient(Setting);
client.start();
