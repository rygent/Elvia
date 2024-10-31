import { ShardingManager } from 'discord.js';
import { type NextFunction, type Request, type Response, Router } from 'express';
import auth from '@/server/middlewares/auth.js';
import createError from 'http-errors';

export const router = Router();
// @ts-expect-error TS2769: No overload matches this call.
router.get('/', auth, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const manager: ShardingManager = req.app.get('shard-manager');

		const shards = await manager.broadcastEval((client) => ({
			id: client.shard?.ids.join(' / '),
			uptime: client.uptime,
			wsStatus: client.ws.status,
			wsPing: client.ws.ping,
			guildCount: client.guilds.cache.size
		}));

		return res.status(200).json(shards);
	} catch {
		next(createError(500));
	}
});
