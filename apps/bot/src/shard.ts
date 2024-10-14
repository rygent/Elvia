import { ShardingManager, WebServer } from '@elvia/tesseract';
import { logger } from '@elvia/logger';
import { Env } from '@/lib/Env.js';
import { gray } from 'colorette';

const manager = new ShardingManager('./dist/index.js');
void manager.spawn();

manager.on('shardCreate', (shard) => {
	logger.info(`Shard ${shard.id} - Launching ${gray(`[${shard.id + 1} of ${manager.totalShards}]`)}`);
});

if (Env.ClientApiAuth && Env.ClientApiPort) {
	const server = new WebServer(manager);
	void server.start(Env.ClientApiPort);
}
