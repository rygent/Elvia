const { EmbedBuilder } = require('@discordjs/builders');
const { WebhookClient, codeBlock, time } = require('discord.js');
const { Console } = require('node:console');
const { inspect } = require('node:util');
const { Colors, Links } = require('./Constants');
const Colorette = require('colorette');
const moment = require('moment');

module.exports = class Logger {

	constructor(client, options = {}) {
		this.client = client;
		this.console = new Console({ stdout: options.stdout || process.stdout, stderr: options.stderr || process.stderr });
		this.depth = options.depth || 5;
	}

	log(content, { infix, color } = {}) {
		return this.write(content, { method: 'log', infix: infix || 'INFO', color: color || 'blueBright' });
	}

	error(content, error) {
		this.sendWebhook(error);
		return this.write(content, { method: 'error', infix: 'ERROR', color: 'redBright' });
	}

	warn(content) {
		return this.write(content, { method: 'warn', infix: 'WARN', color: 'yellowBright' });
	}

	debug(content) {
		return this.write(content, { method: 'debug', infix: 'DEBUG', color: 'blackBright' });
	}

	sendWebhook(error) {
		if (!this.client.isReady()) return;
		if (!error || !Links.LoggerWebhook) return;
		const webhook = new WebhookClient({ url: Links.LoggerWebhook });

		const embed = new EmbedBuilder()
			.setColor(Colors.Red)
			.setTitle(error.name)
			.setDescription([
				`${codeBlock('ts', this.clean(error.stack, { depth: 2 }))}`,
				`***Message:*** ${error.message}`,
				`***Date:*** ${time(new Date(Date.now()), 'D')} (${time(new Date(Date.now()), 'R')})`
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: this.client.user.avatarURL() });

		return webhook.send({ embeds: [embed], username: this.client.user.username, avatarURL: this.client.user.displayAvatarURL({ size: 4096 }) });
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

};
