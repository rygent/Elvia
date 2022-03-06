const moment = require('moment-timezone');
require('dotenv/config');

moment.tz.setDefault(process.env.TIMEZONE);

const BaseClient = require('./Structures/BaseClient');
const Configuration = require('./Utils/Configuration');

const client = new BaseClient(Configuration);
client.start();
