import moment from 'moment-timezone';
import 'dotenv/config';

moment.tz.setDefault(process.env.TIMEZONE);

import BaseClient from './lib/BaseClient.js';
import * as Configuration from './lib/Configuration.js';

const client = new BaseClient(Configuration);
void client.start();
