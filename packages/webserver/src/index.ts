import express, { type Express, type Router } from 'express';
import type { ShardingManager } from 'discord.js';
import errors from '@/server/middlewares/errors.js';
import headers from '@/server/middlewares/headers.js';
import noroutes from '@/server/middlewares/noroutes.js';
import { router } from '@/server/routes/info.js';
import { createJiti } from 'jiti';
import body from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { extname, join, parse, resolve } from 'node:path';
import { existsSync, readdirSync, statSync } from 'node:fs';

const jiti = createJiti(import.meta.url);

export class WebServer {
	public server: Express;

	public constructor(manager: ShardingManager) {
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
		const routes = 'dist/server/routes';
		return resolve(routes);
	}

	private routes() {
		const routes = [];

		for (const fileOrFolder of readdirSync(this.directory)) {
			const filePath = join(this.directory, fileOrFolder);
			const isDirectory = statSync(filePath).isDirectory();

			const pathToLoad = isDirectory ? join(filePath, 'index.js') : filePath;
			const isFile = existsSync(pathToLoad) && statSync(pathToLoad).isFile();

			if (isFile && extname(pathToLoad) === '.js') {
				routes.push({
					name: parse(fileOrFolder).name.toLowerCase(),
					path: pathToLoad
				});
			}
		}

		return routes;
	}

	private async loadRoutes() {
		this.server.use('/', router);

		for (const { name, path } of this.routes()) {
			const route = await jiti.import<{ router: Router }>(path);
			this.server.use(`/${name}`, route.router);
		}

		this.server.use(noroutes);
		this.server.use(errors);
	}

	public async start(port = 8080) {
		await this.loadRoutes();
		this.server.listen(port);
	}
}
