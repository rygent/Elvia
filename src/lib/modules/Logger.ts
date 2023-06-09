import type BaseClient from '#lib/BaseClient.js';
import { createLogger, format, transports } from 'winston';
import { Webhook } from '#lib/modules/transports/Webhooks.js';
import {
	blackBright,
	blueBright,
	cyanBright,
	greenBright,
	isColorSupported,
	magentaBright,
	redBright,
	yellowBright
} from 'colorette';
import { inspect } from 'node:util';
import moment from 'moment';

export default class Logger {
	private readonly client: BaseClient<true> | undefined;

	private readonly level = {
		syslog: 0,
		syserr: 1,
		warn: 2,
		info: 3,
		debug: 4
	};

	private readonly format = format.combine(
		format.timestamp(),
		format.printf(({ timestamp, level, message }) => {
			const shard = this.client ? `${resolveShardId(this.client.shard?.ids[0] as number)} ` : '';
			return `${resolveTimestamp(timestamp)} ${resolveLevel(level)}: ${shard}${message}`;
		})
	);

	public constructor(client?: BaseClient) {
		this.client = client;
	}

	public log(message: string) {
		const logger = createLogger({
			level: 'syslog',
			levels: this.level,
			transports: [new transports.Console({ format: this.format })]
		});

		return logger.log({ level: 'syslog', message });
	}

	public error(message: string, error: Error, webhook?: boolean) {
		const logger = createLogger({
			level: 'syserr',
			levels: this.level,
			transports: [
				new transports.Console({ format: this.format }),
				new transports.File({
					filename: `report.${moment().format('yyyyMMDD.HHmmss')}.log`,
					dirname: `${process.cwd()}/logs`,
					format: format.combine(format.printf(() => clean(error.stack as string)))
				}),
				...(webhook ? [new Webhook(this.client as BaseClient, error)] : [])
			]
		});

		return logger.log({ level: 'syserr', message });
	}

	public warn(message: string) {
		const logger = createLogger({
			level: 'warn',
			levels: this.level,
			transports: [new transports.Console({ format: this.format })]
		});

		return logger.log({ level: 'warn', message });
	}

	public info(message: string) {
		const logger = createLogger({
			level: 'info',
			levels: this.level,
			transports: [new transports.Console({ format: this.format })]
		});

		return logger.log({ level: 'info', message });
	}

	public debug(message: string) {
		const logger = createLogger({
			level: 'debug',
			levels: this.level,
			transports: [new transports.Console({ level: 'debug', format: this.format })]
		});

		return logger.log({ level: 'debug', message });
	}
}

const levels = {
	syslog: blueBright('[SYSLOG]'),
	syserr: redBright('[SYSERR]'),
	warn: yellowBright('[WARN]'),
	info: greenBright('[INFO]'),
	debug: magentaBright('[DEBUG]')
};

const levelLength = Math.max(...Object.values(levels).map((text) => text.length));

function resolveTimestamp(timestamp: string): string {
	return `${blackBright(moment(timestamp).format('MM/DD/YYYY HH:mm:ss z'))}`;
}

function resolveLevel(level: string): string {
	return `${Reflect.get(levels, level)}${' '.repeat(levelLength - Reflect.get(levels, level).length)}`;
}

function resolveShardId(shardId: number): string {
	return cyanBright(`[${shardId ?? 'M'}]`);
}

function clean(input: unknown, depth?: number): string {
	if (typeof input === 'string') return input;
	const cleaned = inspect(input, { colors: isColorSupported, depth: depth });
	return cleaned;
}
