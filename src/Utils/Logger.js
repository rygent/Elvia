import { Console } from 'node:console';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, codeBlock, parseWebhookURL, time } from 'discord.js';
import { Colors, Links } from './Constants.js';
import { inspect } from 'node:util';
import * as Colorette from 'colorette';
import moment from 'moment';
import fs from 'node:fs';

export default class Logger {

	constructor(client, options = {}) {
		this.client = client;
		this.console = new Console({ stdout: options.stdout || process.stdout, stderr: options.stderr || process.stderr });
		this.depth = options.depth || 5;
	}

	log(content) {
		return this.write(content, { type: 'log', level: 'SYSLOG' });
	}

	error(content, error) {
		this.printErr(error);
		return this.write(content, { type: 'error', level: 'SYSERR' });
	}

	warn(content) {
		return this.write(content, { type: 'warn', level: 'WARN' });
	}

	info(content) {
		return this.write(content, { type: 'info', level: 'INFO' });
	}

	debug(content) {
		return this.write(content, { type: 'debug', level: 'DEBUG' });
	}

	webhook(error) {
		if (!this.client.isReady()) return;
		if (!error || !Links.LoggerWebhook) return;
		const webhook = new WebhookClient(parseWebhookURL(Links.LoggerWebhook));

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(error.name)
			.setDescription([
				`${codeBlock('xl', this.clean(error.stack, { depth: 2 }))}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username });
	}

	write(content, options) {
		const timestamp = Colorette.cyanBright(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const level = `${Colorette.bold(getLevel(options.level))} :`;
		return this.console[options.type](timestamp, level, this.clean(content));
	}

	printErr(error) {
		const date = moment().format('yyyyMMDD.HHmmss');
		const dirname = `${process.cwd()}\\logs\\`.replace(/\\/g, '/');
		if (!fs.existsSync(dirname)) {
			fs.mkdirSync(dirname);
		}
		return fs.writeFileSync(`${dirname}report.${date}.log`, Buffer.from(error.stack));
	}

	clean(content, { depth = this.depth } = {}) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { colors: Colorette.isColorSupported, depth });
		return cleaned;
	}

}

const levels = {
	SYSLOG: Colorette.gray('[SYSLOG]'),
	SYSERR: Colorette.redBright('[SYSERR]'),
	WARN: Colorette.yellowBright('[WARN]'),
	INFO: Colorette.blueBright('[INFO]'),
	DEBUG: Colorette.magentaBright('[DEBUG]')
};

const levelLength = Math.max(...Object.values(levels).map(text => text.length));

function getLevel(level) {
	return `${levels[level]}${' '.repeat(levelLength - levels[level].length)}`;
}
