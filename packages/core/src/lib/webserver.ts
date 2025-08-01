import express, { type Express, type Router } from 'express';
import { type CoreShardingManager } from '@/lib/sharding.js';
import errors from '@/server/middlewares/errors.js';
import headers from '@/server/middlewares/headers.js';
import noroutes from '@/server/middlewares/noroutes.js';
import { router } from '@/server/routes/info.js';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import body from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'node:path';

const jiti = createJiti(import.meta.url);

export class CoreWebserver {
	public server: Express;

	public constructor(manager: CoreShardingManager) {
		this.server = express();
		this.server.set('shard-manager', manager);
		this.server.disable('x-powered-by');
		this.server.use(body.json());
		this.server.use(body.urlencoded({ extended: true }));
		this.server.use(compression());
		this.server.use(cors());
		this.server.use(headers);
	}

	private get directory() {
		return `${path.dirname(process.argv[1]!) + path.sep}`.replace(/\\/g, '/');
	}

	protected async loadRoutes() {
		const routeFiles = await globby(`${this.directory}server/routes/**/*.{js,ts}`);

		for (const file of routeFiles) {
			let { name } = path.parse(file);
			const fileName = path.basename(file);
			if (fileName === 'index.js' || fileName === 'index.ts') {
				name = path.basename(path.dirname(file));
			}
			const route = await jiti.import<{ router: Router }>(file);
			this.server.use(`/${name}`, route.router);
		}
	}

	public async start(port = 8080) {
		await this.loadRoutes();

		this.server.use('/', router);
		this.server.use(noroutes);
		this.server.use(errors);

		this.server.listen(port);
	}
}
