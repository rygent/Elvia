import express, { type Express } from 'express';
import { ShardingManager } from 'discord.js';
import errors from '@/server/middlewares/errors.js';
import headers from '@/server/middlewares/headers.js';
import noroutes from '@/server/middlewares/noroutes.js';
import { router } from '@/server/routes/info.js';
import { env } from '@/env.js';
import { createJiti } from 'jiti';
import body from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';

const jiti = createJiti(import.meta.url);

export class WebServer {
	private readonly directory: string;
	public server: Express;

	public constructor(manager: ShardingManager) {
		this.directory = path.resolve('dist/server/routes');

		this.server = express();
		this.server.set('shard-manager', manager);
		this.server.disable('x-powered-by');
		this.server.use(body.json());
		this.server.use(body.urlencoded({ extended: true }));
		this.server.use(compression());
		this.server.use(cors());
		this.server.use(headers);
	}

	private routes() {
		const routes = [];
		for (const route of fs.readdirSync(this.directory)) {
			const dirname = path.join(this.directory, route);
			const filename = fs.statSync(dirname).isDirectory() ? path.join(dirname, 'index.js') : dirname;
			if (path.extname(filename) === '.js' && fs.existsSync(filename)) {
				routes.push({
					name: path.parse(route).name.toLowerCase(),
					path: filename
				});
			}
		}

		return routes;
	}

	private async loadRoutes() {
		this.server.use('/', router);
		for (const route of this.routes()) {
			const file: any = await jiti.import(route.path);
			this.server.use(`/${route.name}`, file.router);
		}
		this.server.use(noroutes);
		this.server.use(errors);
	}

	public async start(port = '8080') {
		await this.loadRoutes();
		this.server.listen(env.Port || port);
	}
}
