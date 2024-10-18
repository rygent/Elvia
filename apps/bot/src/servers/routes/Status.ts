import { ShardingManager } from '@elvia/tesseract';
import { type NextFunction, type Request, type Response, Router } from 'express';
import auth from '@/servers/middlewares/Auth.js';
import createError from 'http-errors';

export const router = Router();
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
