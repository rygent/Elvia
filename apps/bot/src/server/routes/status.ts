import { Router, type NextFunction, type Request, type Response } from 'express';
import { createError, type CoreShardingManager } from '@elvia/core';
import { Status } from 'discord.js';
import auth from '@/server/middlewares/auth.js';

export const router = Router();
router.get('/', auth, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const manager: CoreShardingManager = req.app.get('shard-manager');

		const response = await manager.broadcastEval((client) => ({
			shardId: client.shard?.ids[0],
			uptime: client.uptime,
			wsStatus: Status[client.ws.status],
			wsPing: client.ws.ping,
			userCount: client.users.cache.size,
			guildCount: client.guilds.cache.size,
			memberCount: client.guilds.cache.map((guild) => guild).reduce((a, b) => a + b.memberCount, 0)
		}));

		res.status(200).json(response);
	} catch {
		next(createError(500));
	}
});
