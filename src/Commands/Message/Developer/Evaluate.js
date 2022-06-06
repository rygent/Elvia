const MessageCommand = require('../../../Structures/Command');
const { AttachmentBuilder, Formatters } = require('discord.js');
const { Type } = require('@anishshobith/deeptype');
const { inspect } = require('node:util');
const { Emojis } = require('../../../Utils/Constants');

module.exports = class extends MessageCommand {

	constructor(...args) {
		super(...args, {
			name: 'evaluate',
			aliases: ['eval'],
			description: 'Evaluating javascript language code.',
			category: 'Developer',
			usage: '[code]',
			ownerOnly: true
		});
	}

	async run(message, args) {
		if (!args.length) return message.reply({ content: `Please enter the javascript code that will be evaluated.` });
		let code = args.join(' ');
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaled;
		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}
			const stop = process.hrtime(start);
			const response = [
				`${Formatters.codeBlock('js', this.clean(inspect(evaled, { depth: 0 })))}\n`,
				`${Emojis.Info} ${Formatters.inlineCode(new Type(evaled).is)} `,
				`${Emojis.Alarm} ${Formatters.inlineCode(`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`)}`
			].join('');
			if (response.length < 2048) {
				return message.channel.send({ content: response });
			} else {
				const attachment = new AttachmentBuilder()
					.setFile(Buffer.from(this.clean(inspect(evaled, { depth: 0 }))))
					.setName('output.txt');

				return message.channel.send({ content: response, files: [attachment] });
			}
		} catch (error) {
			return message.channel.send({ content: `**Error:** ${Formatters.codeBlock('xl', this.clean(error))}` });
		}
	}

	clean(text) {
		if (typeof text === 'string') {
			text = text
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(this.client.token, 'gi'), 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');
		}
		return text;
	}

};
