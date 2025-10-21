import { fastify, type FastifyInstance, type FastifyPluginAsync } from 'fastify';
import { type CoreShardingManager } from '@/lib/sharding.js';
import compression from '@fastify/compress';
import cors from '@fastify/cors';
import { globby } from 'globby';
import { createJiti } from 'jiti';
import { basename, dirname, parse, sep } from 'node:path';

const jiti = createJiti(import.meta.url);

export class CoreWebserver {
	public app: FastifyInstance;

	public constructor(manager: CoreShardingManager) {
		this.app = fastify({ logger: false });
		this.app.decorate('shardManager', manager);
		this.app.register(compression);
		this.app.register(cors);

		// @ts-expect-error TS6133: 'request' is declared but its value is never read.
		this.app.addHook('onSend', async (request, reply, payload) => {
			reply.header('X-Frame-Options', 'deny');
			reply.header('X-XSS-Protection', '1; mode=block');
			reply.header('X-Content-Type-Options', 'nosniff');
			reply.header('Content-Security-Policy', "script-src 'self'; object-src 'self'");
			reply.header('X-Permitted-Cross-Domain-Policies', 'none');
			reply.header('Referrer-Policy', 'no-referrer');

			return payload;
		});
	}

	private get directory() {
		return `${dirname(process.argv[1]!) + sep}`.replace(/\\/g, '/');
	}

	protected async loader() {
		const routes = await globby(`${this.directory}routes/**/*.{js,ts}`);

		for (const route of routes) {
			let { name } = parse(route);
			const [filename] = basename(route).split('.');
			if (filename?.match('index')) name = basename(dirname(route));
			const router = await jiti.import<FastifyPluginAsync>(route, { default: true });
			this.app.register(router, { prefix: `/${name}` });
		}
	}

	public async start(port = 8080) {
		await this.loader();

		// @ts-expect-error TS6133: 'request' is declared but its value is never read.
		this.app.get('/', async (request, reply) => {
			try {
				const manager = this.app.getDecorator<CoreShardingManager>('shardManager');

				const response = await manager.broadcastEval((client) => ({
					name: client.user?.displayName,
					version: process.env.npm_package_version,
					shards: client.shard?.count
				}));

				reply.status(200).send(response);
			} catch {
				reply.status(500).send();
			}
		});

		// eslint-disable-next-line promise/prefer-await-to-callbacks
		this.app.setErrorHandler((error, request, reply) => {
			request.log.error(error);

			const status = error.statusCode ?? 500;
			const name = error.name || 'Internal Server Error';
			const message = error.message || 'An unknown error occurred';

			reply.status(status).send({ status, name, message });
		});

		this.app.setNotFoundHandler((request, reply) => {
			const message = `Route ${request.method}:${request.url} not found`;

			reply.status(404).send({ message });
		});

		await this.app.listen({ port, host: '0.0.0.0' });
	}
}
