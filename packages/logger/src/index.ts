import { createLogger, format, transports } from 'winston';
import { DiscordHook, type WebhookOptions } from '@/lib/discord-webhooks.js';
import { clean, resolveLevel, resolveTimestamp } from '@/lib/util.js';
import moment from 'moment';
import 'moment-timezone';
import 'dotenv/config';

const timezone = process.env.TIMEZONE;
moment.tz.setDefault(timezone);

interface LoggerOptions {
	webhook: WebhookOptions;
}

export class Logger {
	private readonly level = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
		fatal: 4
	};

	private readonly format = format.combine(
		format.timestamp(),
		format.printf(({ timestamp, level, message }) => {
			return `${resolveTimestamp(timestamp)} ${resolveLevel(level)}: ${message}`;
		})
	);

	private readonly options: LoggerOptions;

	public constructor(options: LoggerOptions) {
		this.options = options;
	}

	public debug(message: string) {
		const logger = createLogger({
			level: 'debug',
			levels: this.level,
			transports: [new transports.Console({ level: 'debug', format: this.format })]
		});

		return logger.log({ level: 'debug', message });
	}

	public info(message: string) {
		const logger = createLogger({
			level: 'info',
			levels: this.level,
			transports: [new transports.Console({ format: this.format })]
		});

		return logger.log({ level: 'info', message });
	}

	public warn(message: string) {
		const logger = createLogger({
			level: 'warn',
			levels: this.level,
			transports: [new transports.Console({ format: this.format })]
		});

		return logger.log({ level: 'warn', message });
	}

	public error(message: string, error: Error) {
		const logger = createLogger({
			level: 'error',
			levels: this.level,
			transports: [
				new transports.Console({ format: this.format }),
				new transports.File({
					filename: `report.${moment().format('yyyyMMDD.HHmmss')}.log`,
					dirname: `${process.cwd()}/logs/error`,
					format: format.combine(format.printf(() => clean(error.stack as string)))
				}),
				new DiscordHook({ error, webhook: this.options.webhook })
			]
		});

		return logger.log({ level: 'error', message });
	}

	public fatal(message: string, error: Error) {
		const logger = createLogger({
			level: 'fatal',
			levels: this.level,
			transports: [
				new transports.Console({ format: this.format }),
				new transports.File({
					filename: `report.${moment().format('yyyyMMDD.HHmmss')}.log`,
					dirname: `${process.cwd()}/logs/fatal`,
					format: format.combine(format.printf(() => clean(error.stack as string)))
				}),
				new DiscordHook({ error, webhook: this.options.webhook })
			]
		});

		return logger.log({ level: 'fatal', message });
	}
}
