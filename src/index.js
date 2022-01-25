const moment = require('moment-timezone');
require('dotenv').config();

const BaseClient = require('./Structures/BaseClient.js');
const Configuration = require('./Settings/Configuration.js');

moment.tz.setDefault(Configuration.timezone);

const client = new BaseClient(Configuration);
client.start();
