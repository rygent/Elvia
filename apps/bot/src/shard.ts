import { ShardingManager } from 'discord.js';
import { Logger } from '@elvia/logger';
import { Env } from '@/lib/Env.js';
import { gray } from 'colorette';
import 'dotenv/config';

const logger = new Logger({ webhook: { url: Env.LoggerWebhookUrl } });

const manager = new ShardingManager('./dist/index.js');
void manager.spawn();

manager.on('shardCreate', (shard) => {
	logger.info(`Shard ${shard.id} - Launching ${gray(`[${shard.id + 1} of ${manager.totalShards}]`)}`);
});
