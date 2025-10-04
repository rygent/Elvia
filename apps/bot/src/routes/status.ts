import { type CoreShardingManager, type FastifyPluginAsync } from '@elvia/core';
import { Status } from 'discord.js';
import { env } from '@/env.js';

// eslint-disable-next-line @typescript-eslint/require-await
const router: FastifyPluginAsync = async (app) => {
	// eslint-disable-next-line prettier/prettier
	app.get('/',
		{
			preHandler: async (request, reply) => {
				const { authorization } = request.headers;

				if (!authorization || authorization !== env.SERVER_API_AUTH) {
					return reply.status(401).send({ message: 'Unauthorized' });
				}
			}
		},
		// @ts-expect-error TS6133: 'request' is declared but its value is never read.
		async (request, reply) => {
			try {
				const manager = app.getDecorator<CoreShardingManager>('shardManager');

				const response = await manager.broadcastEval(async (client) => {
					const shardIds = await client.ws.getShardIds();

					return {
						shardId: shardIds[0],
						uptime: client.uptime,
						status: Status[client.status],
						ping: client.ping,
						userCount: client.users.cache.size,
						guildCount: client.guilds.cache.size,
						memberCount: client.guilds.cache.map((guild) => guild).reduce((a, b) => a + b.memberCount, 0)
					};
				});

				reply.status(200).send(response);
			} catch {
				reply.status(500).send();
			}
		}
	);
};

export default router;
