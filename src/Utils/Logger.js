const { EmbedBuilder } = require('@discordjs/builders');
const { Formatters, WebhookClient } = require('discord.js');
const { Console } = require('node:console');
const { inspect } = require('node:util');
const { Colors, Links } = require('./Constants');
const Colorette = require('colorette');
const moment = require('moment');

module.exports = class Logger {

	constructor(client, options = {}) {
		this.client = client;
		this.console = new Console({ stdout: options.stdout || process.stdout, stderr: options.stderr || process.stderr });
		this.depth = options.depth || 2;
	}

	log(content, options = {}) {
		return this.write(content, { method: 'log', infix: options.infix || 'INFO', color: options.color || 'blueBright' });
	}

	error(content, options = {}) {
		this.write(content, { method: 'error', infix: 'ERROR', color: 'redBright' });

		if (!this.client.isReady()) return;
		if (!options.error || !Links.LoggerWebhook) return;
		const webhook = new WebhookClient({ url: Links.LoggerWebhook });

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(options.name || null)
			.setDescription([
				`${Formatters.codeBlock('ts', options.error.stack)}`,
				`***Name:*** ${options.error.name}`,
				`***Message:*** ${options.error.message}`,
				`***Date:*** ${Formatters.time(new Date(Date.now()), 'D')} (${Formatters.time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ size: 4096 }) });
	}

	warn(content) {
		return this.write(content, { method: 'warn', infix: 'WARN', color: 'yellowBright' });
	}

	debug(content) {
		return this.write(content, { method: 'debug', infix: 'DEBUG', color: 'blackBright' });
	}

	write(content, options = {}) {
		const timestamp = Colorette.dim(moment().format('DD/MM/YYYY HH:mm:ss z'));
		const infix = `[\u200B${Colorette.bold(Colorette[options.color](options.infix))}\u200B]`;
		return this.console[options.method](timestamp, infix, this.clean(content));
	}

	clean(content) {
		if (typeof content === 'string') return content;
		const cleaned = inspect(content, { colors: Colorette.isColorSupported, depth: this.depth });
		return cleaned;
	}

};
