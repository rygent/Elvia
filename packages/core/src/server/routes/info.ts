import type { ShardingManager } from 'discord.js';
import { Router } from 'express';
import createError from 'http-errors';

export const router = Router();
router.get('/', async (req, res, next) => {
	try {
		const manager: ShardingManager = req.app.get('shard-manager');

		const response = await manager.broadcastEval((client) => ({
			name: client.user?.displayName,
			version: process.env.npm_package_version,
			shards: client.shard?.count
		}));

		res.status(200).json(response);
	} catch {
		next(createError(500));
	}
});
