const Command = require('../../../Structures/Command');
const { Formatters, MessageAttachment } = require('discord.js');
const { Type } = require('@anishshobith/deeptype');
const { inspect } = require('node:util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
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
				`**Output:** ${Formatters.codeBlock('js', this.clean(inspect(evaled, { depth: 0 })))}`,
				`**Type:** ${Formatters.codeBlock('ts', new Type(evaled).is)}`,
				`**Time:** ${Formatters.inlineCode(`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms`)}`
			];
			const res = response.join('\n');
			if (res.length < 2000) {
				await message.channel.send({ content: res });
			} else {
				const output = new MessageAttachment(Buffer.from(res), 'output.txt');
				await message.channel.send({ files: [output] });
			}
		} catch (err) {
			return message.channel.send({ content: `**Error:** ${Formatters.codeBlock('xl', this.clean(err))}` });
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
