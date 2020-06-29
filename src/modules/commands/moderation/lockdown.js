const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');
const ms = require('ms');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lock', 'ld'],
			description: 'Locks a channel down for a set duration. Use `lockdown release` to end the lockdown prematurely.',
			category: 'moderation',
			usage: '<duration> <sec|min|hr>',
			memberPerms: ['MANAGE_CHANNELS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [time]) {
		if (!this.client.lockit) this.client.lockit = [];
		if (!time) {
			return message.channel.send('A duration for the lockdown must be set. This can be in hours, minutes or seconds.');
		}

		const roleColor = message.guild.me.roles.highest.hexColor;
		const validUnlocks = ['release', 'rel', 'unlock', 'end', 'stop'];
		if (validUnlocks.includes(time)) {
			message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: null }).then(() => {
				message.channel.send('Lockdown lifted.');
				clearTimeout(this.client.lockit[message.channel.id]);
				delete this.client.lockit[message.channel.id];
			});
		} else {
			message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: false }).then(() => {
				const embed = new MessageEmbed()
					.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
					.setTitle('🔒 Channel locked down')
					.setDescription(stripIndents`
                        ***Duration:*** ${ms(ms(time), { long: true })}
                        ***Issued by:*** ${message.author.tag} (${message.author.id})`)
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				message.channel.send(embed).then(() => {
					this.client.lockit[message.channel.id] = setTimeout(() => {
						message.channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: null })
							.then(message.channel.send('Lockdown lifted.'));
						delete this.client.lockit[message.channel.id];
					}, ms(time));
				});
			});
		}
	}

};
