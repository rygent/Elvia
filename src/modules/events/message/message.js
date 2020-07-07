const Event = require('../../../structures/Event.js');
const cmdCooldown = {};

module.exports = class extends Event {

	/* eslint-disable consistent-return */ /* eslint-disable complexity */
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			message.channel.send(`My prefix for **${message.guild.name}** is \`${this.client.prefix}\`.`);
		}

		const prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (!command) {
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
				return this.client.embeds.errors('clientPerms', message, neededPermission.map(perm => `\`${perm}\``).join(', '));
			}
			neededPermission = [];
			command.memberPerms.forEach((perm) => {
				if (!message.channel.permissionsFor(message.member).has(perm)) {
					neededPermission.push(perm);
				}
			});
			if (neededPermission.length > 0) {
				return this.client.embeds.errors('memberPerms', message, neededPermission.map(perm => `\`${perm}\``).join(', '));
			}

			if (!message.channel.nsfw && command.nsfw) {
				return this.client.embeds.errors('nsfwOnly', message);
			}
		}

		// eslint-disable-next-line no-process-env
		if (command.ownerOnly && message.author.id !== process.env.OWNER) {
			return this.client.embeds.errors('ownerOnly', message);
		}

		let uCooldown = cmdCooldown[message.author.id];
		if (!uCooldown) {
			cmdCooldown[message.author.id] = {};
			uCooldown = cmdCooldown[message.author.id];
		}
		const time = uCooldown[command.name] || 0;
		if (time && (time > Date.now())) {
			return this.client.embeds.errors('cooldownTime', message, Math.ceil((time - Date.now()) / 1000));
		}
		cmdCooldown[message.author.id][command.name] = Date.now() + command.cooldown;

		try {
			command.run(message, args);
			if (command.category === 'owner') {
				message.delete();
			}
		} catch (err) {
			console.log(err);
			return this.client.embeds.errors(null, message);
		}
	}

};
