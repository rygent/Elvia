import BaseClient from '#lib/BaseClient.js';
import * as Configuration from '#lib/Configuration.js';
import 'dotenv/config';

const client = new BaseClient(Configuration);
void client.start();
