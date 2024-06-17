import type { Client } from 'discord.js';
import { createLogger, format, transports } from 'winston';
import { Discord } from '@/transports/discord.js';
import { clean, resolveLevel, resolveShardId, resolveTimestamp } from '@/lib/util.js';
import moment from 'moment';
import 'moment-timezone';
import 'dotenv/config';

const timezone = process.env.TIMEZONE;
moment.tz.setDefault(timezone);

export class Logger {
	private readonly client: Client | undefined;

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

	public constructor(client?: Client) {
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

	public error(message: string, error: Error) {
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
				new Discord({ ...(this.client && { client: this.client }), error })
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
