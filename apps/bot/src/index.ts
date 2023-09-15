import { BaseClient } from '#lib/structures/BaseClient.js';
import * as Config from '#lib/Configs.js';
import 'dotenv/config';

const client = new BaseClient(Config);
void client.start();
