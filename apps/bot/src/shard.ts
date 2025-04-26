import { CoreWebServer, CoreShardingManager } from '@elvia/core';
import { logger } from '@elvia/logger';
import { gray } from 'colorette';
import { env } from '@/env.js';

const manager = new CoreShardingManager('./dist/index.js', { totalShards: 'auto' });
void manager.spawn();

manager.on('shardCreate', (shard) => {
	logger.info(`Launching ${gray(`[${shard.id + 1} of ${manager.totalShards}]`)}`, { shardId: shard.id });
});

if (env.SERVER_API_AUTH && env.SERVER_API_PORT) {
	const server = new CoreWebServer(manager);
	void server.start(env.SERVER_API_PORT);
}
