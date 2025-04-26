import { CoreShardingManager, createError, type NextFunction, type Request, type Response, Router } from '@elvia/core';
import auth from '@/server/middlewares/auth.js';

export const router = Router();
router.get('/', auth, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const manager: CoreShardingManager = req.app.get('shard-manager');

		const response = await manager.broadcastEval((client) => ({
			shardId: client.shard?.ids.join(' / '),
			uptime: client.uptime,
			wsStatus: client.ws.status,
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
