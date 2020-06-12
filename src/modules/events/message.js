module.exports = class {

	constructor(client) {
		this.client = client;
	}

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			this.client.embed.generals('', message, `My prefix for **${message.guild.name}** is \`${this.client.PREFIX}\`.`);
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.PREFIX;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (!command) {
			return;
		}

		if (command.guildOnly && !message.guild) {
			message.channel.send('This command is only available on a server!');
			return;
		}

		if (message.guild) {
			let neededPermission = [];
			if (!command.clientPerms.includes('EMBED_LINKS')) {
				command.clientPerms.push('EMBED_LINKS');
			}
			command.clientPerms.forEach((perm) => {
				if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
					neededPermission.push(perm);
				}
			});
			if (neededPermission.length > 0) {
				message.channel.send(`I need the following permissions to perform this command: \`${neededPermission.map(pe => `\`${pe}\``).join(', ')}\``);
				return;
			}
			neededPermission = [];
			command.memberPerms.forEach((perm) => {
				if (!message.channel.permissionsFor(message.member).has(perm)) {
					neededPermission.push(perm);
				}
			});
			if (neededPermission.length > 0) {
				message.channel.send(`You do not have the necessary permissions to perform this command (\`${neededPermission.map(pe => `\`${pe}\``).join(', ')}\`)`);
				return;
			}
		}

		// eslint-disable-next-line no-process-env
		if (command.ownerOnly && message.author.id !== process.env.OWNER) {
			message.channel.send('Only owners can do these commands!');
			return;
		}

		try {
			command.run(message, args);
			if (command.category === 'owner') {
				message.delete();
			}
		} catch (err) {
			console.log(err);
			message.channel.send('An error has occurred, please try again in a few minutes.');
			return;
		}
	}

};
