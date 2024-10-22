import { createLogger, Logger, transports, type LeveledLogMethod } from 'winston';
import { Discord } from '@/lib/transport/discord.js';
import { customLevel } from '@/lib/constants.js';
import { formatBuilder } from '@/lib/utils.js';
import { env } from '@/env.js';
import moment from 'moment-timezone';
import 'winston-daily-rotate-file';

const timezone = env.Timezone || 'UTC';
moment.tz.setDefault(timezone);

if (!env.LoggerWebhookUrl) throw new Error('The LOGGER_WEBHOOK_URL environment variable is required.');

export const logger = createLogger({
	level: env.DebugMode ? 'debug' : 'info',
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
		new Discord({ level: 'error', webhookUrl: env.LoggerWebhookUrl })
	]
}) as Logger & Record<keyof typeof customLevel, LeveledLogMethod>;
