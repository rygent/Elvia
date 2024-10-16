import pino from 'pino';
import pretty, { type PrettyOptions } from 'pino-pretty';
import { discord } from '@/transport/Discord.js';
import { blackBright, white } from 'colorette';
import 'dotenv/config';

const options: PrettyOptions = {
	colorize: true,
	translateTime: 'UTC:dd/mm/yyyy HH:MM:ss Z',
	ignore: 'pid,hostname',
	customPrettifiers: {
		time: (timestamp) => blackBright(timestamp as string)
	},
	messageFormat: (log, messageKey, _levelLabel) => {
		return white(`${log[messageKey]}`);
	}
};

const streams = [
	{ stream: pretty({ ...options, sync: true }) },
	{
		level: 'error',
		stream: pretty({
			...options,
			colorize: false,
			destination: `${process.cwd()}/logs/error.log`,
			mkdir: true,
			sync: true,
			append: true
		})
	},
	{
		level: 'error',
		stream: discord({ url: process.env.LOGGER_WEBHOOK_URL! })
	}
];

export const logger = pino({ level: 'info' }, pino.multistream(streams));
