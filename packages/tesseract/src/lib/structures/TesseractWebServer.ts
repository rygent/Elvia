import express, { type Express } from 'express';
import type { TesseractShardingManager } from '@/lib/structures/TesseractShardingManager.js';
import errors from '@/lib/server/middlewares/errors.js';
import headers from '@/lib/server/middlewares/headers.js';
import noroutes from '@/lib/server/middlewares/noroutes.js';
import { router } from '@/lib/server/routes/info.js';
import body from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export class TesseractWebServer {
	private readonly directory: string;
	public server: Express;

	public constructor(manager: TesseractShardingManager) {
		this.directory = path.resolve('dist/servers/routes');

		this.server = express();
		this.server.set('shard-manager', manager);
		this.server.disable('x-powered-by');
		this.server.use(body.json());
		this.server.use(body.urlencoded({ extended: true }));
		this.server.use(compression());
		this.server.use(cors());
		this.server.use(morgan('dev'));
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

	private async init() {
		this.server.use('/', router);
		for (const route of this.routes()) {
			const file = await import(pathToFileURL(route.path).toString());
			this.server.use(`/${route.name}`, file.router);
		}
		this.server.use(noroutes);
		this.server.use(errors);
	}

	public async start(port = '8080') {
		await this.init();
		this.server.listen(Number.parseInt(process.env.PORT ?? port, 10));
	}
}
