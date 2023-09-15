import { BaseClient } from '#lib/structures/BaseClient.js';
import * as Configuration from '#lib/Configuration.js';
import 'dotenv/config';

const client = new BaseClient(Configuration);
void client.start();
