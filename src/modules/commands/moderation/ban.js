const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['banish', 'permban'],
			description: 'Bans the given user and DMs them the reason!',
			category: 'moderation',
			usage: '<mention|id> <reason>',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.channel.send('Please mention a valid member!');
		if (member.id === this.client.user.id) return message.channel.send('Please don\'t banned me...!');
		if (member.id === message.author.id) return message.channel.send('You can\'t banned yourself!');
		// eslint-disable-next-line no-process-env
		if (member.id === process.env.OWNER) return message.channel.send('I can\'t banned my master');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.channel.send(`You can't banned **${member.user.username}**! Their position is higher than you!`);
		}

		let reason = args.join(' ');
		if (!reason) {
			const msg = await message.channel.send('Please enter a reason for the ban...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.');
			// eslint-disable-next-line no-shadow
			await message.channel.awaitMessages(msg => msg.author.id === message.author.id, { errors: ['time'], max: 1, time: 60000 }).then(resp => {
				// eslint-disable-next-line prefer-destructuring
				resp = resp.array()[0];
				if (resp.content.toLowerCase() === 'cancel') return msg.edit('Cancelled. The user has not been banned.');
				reason = resp.content;
				if (reason) {
					msg.delete();
				}
			}).catch(() => {
				msg.edit('Timed out. The user has not been banned.');
			});
		}

		if (reason) {
			if (!message.guild.member(member).bannable) {
				return message.channel.send('I cannot ban that user from this server!\nThis may be because I do not have the required permissions to do so, or they may be the server owner.');
			}

			message.guild.members.ban(member, { days: 1, reason: `${message.author.tag}: ${reason}` });

			if (!member.user.bot) {
				const embed = new MessageEmbed()
					.setColor(Colors.RED)
					.setTitle('🚫 Banned')
					.setDescription(stripIndents`
						Hello <@${member.id}>,
						You have just been banned from **${message.guild.name}** by **${message.author.tag}**
                        Reason: **${reason}**\n
                        __*Please make sure you always follow the rules, because not doing so can result in punishment.*__`)
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				member.send(embed);
			}
			message.channel.send(`✅ **${member}**, has been successfully banned.`);
		}
	}

};
