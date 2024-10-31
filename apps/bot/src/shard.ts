import { ShardingManager } from 'discord.js';
import { WebServer } from '@elvia/webserver';
import { logger } from '@elvia/logger';
import { gray } from 'colorette';
import { env } from '@/env.js';

const manager = new ShardingManager('./dist/index.js', { token: env.DiscordToken, totalShards: 'auto' });
void manager.spawn();

manager.on('shardCreate', (shard) => {
	logger.info(`Launching ${gray(`[${shard.id + 1} of ${manager.totalShards}]`)}`, { shardId: shard.id });
});

if (env.ClientApiAuth && env.ClientApiPort) {
	const server = new WebServer(manager);
	void server.start(env.ClientApiPort);
}
