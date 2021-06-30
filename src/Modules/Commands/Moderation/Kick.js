const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Kick certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			userPerms: ['KICK_MEMBERS'],
			clientPerms: ['KICK_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply('Please specify a valid member to kick!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (!member.kickable) return message.reply(`I can't kick **${member.displayName}**! For having a higher role than mine!`);
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply('You can\'t kick a member who has an higher or equal role hierarchy to yours!');
		}

		const reason = args.join(' ');
		if (!reason) return message.reply('Please enter a reason!');

		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirm')
				.setCustomID('confirm'))
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancel')
				.setCustomID('cancel'));

		return message.reply({ content: `Please confirm if you want to kick **${member.displayName}**!`, components: [row] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentInteractionCollector(filter, { time: 10000 });

			collector.on('collect', async (button) => {
				if (button.customID === 'confirm') {
					if (!member.user.bot) {
						await member.send([
							`Hello **${member.user.username}**, You've just been kicked from _${message.guild.name}_ by _${message.author.tag}_!`,
							`***Reason:*** ${reason}`
						].join('\n'));
					}

					message.guild.members.kick(member, `${message.author.tag}: ${reason}`).then(() => {
						button.update({ content: [
							`**${member.displayName}** has been successfully kicked from this guild!`,
							`***Reason:*** ${reason}`
						].join('\n'), components: [] });

						const caseInfo = {
							channel: message.channel.id,
							moderator: message.author.id,
							date: Date.now(),
							type: 'kick',
							case: guildData.casesCount,
							reason
						};

						memberData.sanctions.push(caseInfo);
						memberData.save();

						guildData.casesCount++;
						guildData.save();

						if (guildData.plugins.moderations) {
							const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
							if (!sendChannel) return;

							const embed = new MessageEmbed()
								.setColor(Colors.ORANGE)
								.setAuthor(`Actioned by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
								.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
								.setDescription([
									`***Member:*** ${member.user.tag} (\`${member.user.id}\`)`,
									`***Action:*** Kick`,
									`***Reason:*** ${reason}`
								].join('\n'))
								.setFooter(`Case #${guildData.casesCount} | Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

							return sendChannel.send({ embeds: [embed] });
						}
					});
				}

				if (button.customID === 'cancel') {
					collector.stop();
					return button.update({ content: 'Command has been cancelled!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 5000));
				}
			});

			collector.on('end', (collected) => {
				if (collected.size === 0) {
					return msg.edit({ content: 'Time has run out, please use the command again!', components: [] }).then(this.client.setTimeout(() => message.delete() && msg.delete(), 5000));
				}
			});
		});
	}

};
