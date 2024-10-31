import { Router } from 'express';

export const router = Router();
// @ts-expect-error TS2769: No overload matches this call.
router.get('/', (req, res) => {
	const shard = req.app.get('shard-manager');

	const response = {
		version: process.env.npm_package_version,
		shards: shard?.totalShards
	};

	return res.status(200).json(response);
});
