import { createLogger, Logger, transports, type LeveledLogMethod } from 'winston';
import { Discord } from '@/lib/transport/discord.js';
import { customLevel } from '@/lib/constants.js';
import { formatBuilder } from '@/lib/utils.js';
import { env } from '@/env.js';
import moment from 'moment-timezone';
import 'winston-daily-rotate-file';

const timezone = env.TIMEZONE || 'UTC';
moment.tz.setDefault(timezone);

if (!env.LOGGER_WEBHOOK_URL) throw new Error('The LOGGER_WEBHOOK_URL environment variable is required.');

export const logger = createLogger({
	level: env.DEBUG_MODE ? 'debug' : 'info',
	levels: customLevel,
	transports: [
		new transports.Console({ format: formatBuilder(true) }),
		new transports.DailyRotateFile({
			level: 'error',
			format: formatBuilder(false),
			datePattern: 'yyyyMMDD',
			dirname: `${process.cwd()}/logs`,
			filename: 'report.%DATE%.log',
			maxFiles: '14d'
		}),
		new Discord({ level: 'error', unique: true, webhookUrl: env.LOGGER_WEBHOOK_URL })
	]
}) as Logger & Record<keyof typeof customLevel, LeveledLogMethod>;
