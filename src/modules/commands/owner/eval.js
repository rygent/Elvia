const Command = require('../../../structures/Command.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'eval',
			aliases: [],
			description: 'Evaluate JS Code.',
			category: 'owner',
			usage: '<code>',
			clientPerms: ['SEND_MESSAGES'],
			ownerOnly: true
		});
	}

	/* eslint-disable consistent-return */
	async run(message, args) {
		const code = args.join(' ');
		try {
			const evaled = eval(code);
			const clean = await this.client.clean(evaled);
			const MAX_CHARS = 3 + 2 + clean.length + 3;
			if (MAX_CHARS > 2000) {
				return message.channel.send(`Output exceeded 2000 characters. Sending as a file.`, { file: Buffer.from(clean), name: 'output.txt' });
			}
			message.channel.send(`\`\`\`js\n${clean || ':shrug:'}\n\`\`\``);
		} catch (err) {
			const clean = await this.client.clean(err);
			const MAX_CHARS = 3 + 2 + clean.length + 3;
			if (MAX_CHARS > 2000) {
				return message.channel.send(`Output exceeded 2000 characters. Sending as a file.`, { file: Buffer.from(clean), name: 'output.txt' });
			}
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean || ':shrug:'}\n\`\`\``);
		}
	}

};
