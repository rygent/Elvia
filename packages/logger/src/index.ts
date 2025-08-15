import * as winston from 'winston';
import { DiscordTransport } from '@/lib/transport/discord.js';
import { formatters, levels } from '@/lib/formatter.js';
import moment from 'moment';
import 'winston-daily-rotate-file';
import 'moment-timezone';

const timezone = process.env.TZ || 'UTC';
moment.tz.setDefault(timezone);

export const logger = winston.createLogger({
	level: process.env.DEBUG === 'true' ? 'debug' : 'info',
	levels: levels,
	transports: [
		new winston.transports.Console({ format: formatters({ colorize: true }) }),
		new winston.transports.DailyRotateFile({
			level: 'error',
			format: formatters({ colorize: false }),
			datePattern: 'yyyyMMDD',
			dirname: `${process.cwd()}/logs`,
			filename: 'report.%DATE%.log',
			maxFiles: '14d'
		}),
		new DiscordTransport({ level: 'error', webhookUrl: process.env.LOGGER_WEBHOOK_URL })
	]
}) as winston.Logger & Record<keyof typeof levels, winston.LeveledLogMethod>;
