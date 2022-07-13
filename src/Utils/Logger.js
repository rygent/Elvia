import { Console } from 'node:console';
import { inspect } from 'node:util';
import { EmbedBuilder } from '@discordjs/builders';
import * as Colorette from 'colorette';
import { WebhookClient, codeBlock, parseWebhookURL, time } from 'discord.js';
import moment from 'moment';
import { Colors, Links } from './Constants.js';

export default class Logger {

	constructor(client, options = {}) {
		this.client = client;
		this.console = new Console({ stdout: options.stdout || process.stdout, stderr: options.stderr || process.stderr });
		this.depth = options.depth || 5;
	}

	log(content, { infix, color } = {}) {
		return this.write(content, { method: 'log', infix: infix || 'INFO', color: color || 'blueBright' });
	}

	error(content, error) {
		this.webhook(error);
		return this.write(content, { method: 'error', infix: 'ERROR', color: 'redBright' });
	}

	warn(content) {
		return this.write(content, { method: 'warn', infix: 'WARN', color: 'yellowBright' });
	}

	debug(content) {
		return this.write(content, { method: 'debug', infix: 'DEBUG', color: 'blackBright' });
	}

	webhook(error) {
		if (!this.client.isReady()) return;
		if (!error || !Links.LoggerWebhook) return;
		const webhook = new WebhookClient(parseWebhookURL(Links.LoggerWebhook));

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(error.name)
			.setDescription([
				`${codeBlock('ts', this.clean(error.stack, { depth: 2 }))}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username });
	}

	write(content, options) {
		const timestamp = Colorette.dim(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const infix = `[\u200B${Colorette.bold(Colorette[options.color](options.infix))}\u200B]`;
		return this.console[options.method](timestamp, infix, this.clean(content));
	}

	clean(content, { depth = this.depth } = {}) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { colors: Colorette.isColorSupported, depth });
		return cleaned;
	}

}
