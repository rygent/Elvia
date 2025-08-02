import { CoreWebserver, CoreShardingManager } from '@elvia/core';
import { logger } from '@elvia/logger';
import { gray } from 'colorette';
import { env } from '@/env.js';
import dotenv from 'dotenv';

// eslint-disable-next-line import-x/no-named-as-default-member
dotenv.config({ override: true, quiet: true });

const manager = new CoreShardingManager('./dist/index.js', { totalShards: 'auto' });
void manager.spawn();

manager.on('shardCreate', (shard) => {
	logger.info(`Launching ${gray(`[${shard.id + 1} of ${manager.totalShards}]`)}`, { shardId: shard.id });
});

if (env.SERVER_API_AUTH && env.SERVER_API_PORT) {
	const server = new CoreWebserver(manager);
	void server.start(env.SERVER_API_PORT);
}
