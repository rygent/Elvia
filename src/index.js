import moment from 'moment-timezone';
import 'dotenv/config';

import BaseClient from './Structures/BaseClient.js';
import * as Configuration from './Utils/Configuration.js';

moment.tz.setDefault(Configuration.timezone);

const client = new BaseClient(Configuration);
client.start();
