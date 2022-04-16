const moment = require('moment-timezone');
require('dotenv/config');

const BaseClient = require('./Structures/BaseClient');
const Configuration = require('./Utils/Configuration');

moment.tz.setDefault(Configuration.timezone);

const client = new BaseClient(Configuration);
client.start();
