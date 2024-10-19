import { createLogger, Logger, transports, type LeveledLogMethod } from 'winston';
import { WinstonDiscord } from '@/lib/transport/discord.js';
import { customConsoleFormat, customFileFormat, customLevel } from '@/lib/constants.js';
import moment from 'moment';
import 'winston-daily-rotate-file';
import 'moment-timezone';
import 'dotenv/config';

const timezone = process.env.TZ ?? 'UTC';
moment.tz.setDefault(timezone);

const webhookUrl = process.env.LOGGER_WEBHOOK_URL;
if (!webhookUrl) throw new Error('The LOGGER_WEBHOOK_URL environment variable is required.');

export const logger = createLogger({
	level: 'info',
	levels: customLevel,
	transports: [
		new transports.Console({ format: customConsoleFormat }),
		new transports.DailyRotateFile({
			level: 'error',
			format: customFileFormat,
			datePattern: 'yyyyMMDD',
			dirname: `${process.cwd()}/logs`,
			filename: 'report.%DATE%.log',
			maxFiles: '14d'
		}),
		new WinstonDiscord({ level: 'error', webhookUrl })
	]
}) as Logger & Record<keyof typeof customLevel, LeveledLogMethod>;
