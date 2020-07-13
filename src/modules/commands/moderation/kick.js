const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['boot'],
			description: 'Kicks the given user and DMs them the reason!',
			category: 'moderation',
			usage: '<mention|id> <reason>',
			memberPerms: ['KICK_MEMBERS'],
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args], data) {
		const member = message.mentions.members.last() || message.guild.members.cache.get(target);
		if (!member) return message.channel.send('Please mention a valid member!');

		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (member.id === this.client.user.id) return message.channel.send('Please don\'t kick me...!');
		if (member.id === message.author.id) return message.channel.send('You can\'t kick yourself!');
		// eslint-disable-next-line no-process-env
		if (member.id === process.env.OWNER) return message.channel.send('I can\'t kick my master');
		if (message.guild.member(message.author).roles.highest.position <= message.guild.member(member).roles.highest.position) {
			return message.channel.send(`You can't kick **${member.user.username}**! Their position is higher than you!`);
		}

		let reason = args.join(' ');
		if (!reason) {
			const msg = await message.channel.send('Please enter a reason for the kick...\nThis text-entry period will time-out in 60 seconds. Reply with `cancel` to exit.');
			// eslint-disable-next-line no-shadow
			await message.channel.awaitMessages(msg => msg.author.id === message.author.id, { errors: ['time'], max: 1, time: 60000 }).then(resp => {
				// eslint-disable-next-line prefer-destructuring
				resp = resp.array()[0];
				if (resp.content.toLowerCase() === 'cancel') return msg.edit('Cancelled. The user has not been kicked.');
				reason = resp.content;
				if (reason) {
					msg.delete();
				}
			}).catch(() => {
				msg.edit('Timed out. The user has not been kicked.');
			});
		}

		if (reason) {
			if (!message.guild.member(member).kickable) {
				return message.channel.send(`I can't kick **${member.user.username}**! Their role is higher than mine!`);
			}

			if (!member.user.bot) {
				const embed = new MessageEmbed()
					.setColor(Colors.ORANGE)
					.setTitle('👢 Kicked')
					.setDescription(stripIndents`
                        Hello <@${member.id}>,
                        You have just been kicked out from **${message.guild.name}** by **${message.author.tag}**
                        Reason: **${reason}**\n
                        __*Please make sure you always follow the rules, because not doing so can result in punishment.*__`)
					.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				member.send(embed);
			}
			member.kick(`${message.author.tag}: ${reason}`).then(() => {
				message.channel.send(`✅ **${member}**, has been successfully kicked out.`);

				data.guild.casesCount++;
				data.guild.save();

				const caseInfo = {
					channel: message.channel.id,
					moderator: message.author.id,
					date: Date.now(),
					type: 'kick',
					case: data.guild.casesCount,
					reason
				};

				memberData.sanctions.push(caseInfo);
				memberData.save();

				if (data.guild.plugins.modlogs) {
					const sendChannel = message.guild.channels.cache.get(data.guild.plugins.modlogs);
					if (!sendChannel) return;

					const roleColor = message.guild.me.roles.highest.hexColor;

					const embed = new MessageEmbed()
						.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
						.setAuthor(`Moderation: Kick | Case #${data.guild.casesCount}`, member.user.avatarURL({ dynamic: true }))
						.setDescription(stripIndents`
							***User:*** ${member.user.tag} (${member.user.id})
							***Moderator:*** ${message.author.tag} (${message.author.id})
							***Reason:*** ${reason}
						`)
						.setFooter(`Moderation system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

					sendChannel.send(embed);
				}
			});
		}
	}

};
