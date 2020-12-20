const Command = require('../../../Structures/Command.js');
const { MessageAttachment } = require('discord.js');
const { Type } = require('@extreme_hero/deeptype');
const { inspect } = require('util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['eval'],
			description: 'Evaluate JS Code.',
			category: 'Developer',
			usage: '<code>',
			ownerOnly: true,
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const msg = message;
		if (!args.length) return msg.reply(`I need a code to eval!`);
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
				`**Output:** \`\`\`js\n${this.clean(inspect(evaled, { depth: 0 }))}\n\`\`\``,
				`**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
				`**Time Taken:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms\`\`\``
			];
			const res = response.join('\n');
			if (res.length < 2000) {
				await msg.channel.send(res);
			} else {
				const output = new MessageAttachment(Buffer.from(res), 'output.txt');
				await msg.channel.send(output);
			}
		} catch (err) {
			return message.channel.send(`Error:\`\`\`xl\n${this.clean(err)}\n\`\`\``);
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
