import { createLogger, Logger, transports, type LeveledLogMethod } from 'winston';
import { Discord } from '@/lib/transport/discord.js';
import { customLevel } from '@/lib/constants.js';
import { formatBuilder } from '@/lib/utils.js';
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
		new transports.Console({ format: formatBuilder(true) }),
		new transports.DailyRotateFile({
			level: 'error',
			format: formatBuilder(false),
			datePattern: 'yyyyMMDD',
			dirname: `${process.cwd()}/logs`,
			filename: 'report.%DATE%.log',
			maxFiles: '14d'
		}),
		new Discord({ level: 'error', webhookUrl })
	]
}) as Logger & Record<keyof typeof customLevel, LeveledLogMethod>;
