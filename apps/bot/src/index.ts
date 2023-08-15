import moment from 'moment-timezone';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
moment.tz.setDefault(process.env.TIMEZONE);

import BaseClient from '#lib/BaseClient.js';
import * as Configuration from '#lib/Configuration.js';

const client = new BaseClient(Configuration);
void client.start();
