const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Ban certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			userPerms: ['BAN_MEMBERS'],
			clientPerms: ['BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target, ...args]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply('Please specify a valid member to ban!');

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (!member.bannable) return message.reply(`I can't banned **${member.displayName}**! For having a higher role than mine!`);
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply('You can\'t ban a member who has an higher or equal role hierarchy to yours!');
		}

		const reason = args.join(' ');
		if (!reason) return message.reply('Please enter a reason!');

		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SUCCESS')
				.setLabel('Confirm')
				.setCustomId('confirm'))
			.addComponents(new MessageButton()
				.setStyle('DANGER')
				.setLabel('Cancel')
				.setCustomId('cancel'));

		return message.reply({ content: `Please confirm if you want to ban **${member.displayName}**!`, components: [row] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentCollector(filter, { time: 10000 });

			collector.on('collect', async (button) => {
				if (button.customId === 'confirm') {
					if (!member.user.bot) {
						await member.send([
							`Hello **${member.user.username}**, You've just been banned from _${message.guild.name}_ by _${message.author.tag}_!`,
							`***Reason:*** ${reason}`
						].join('\n'));
					}

					message.guild.members.ban(member, { reason: `${message.author.tag}: ${reason}` }).then(() => {
						button.update({ content: [
							`**${member.displayName}** has been successfully banned from this guild!`,
							`***Reason:*** ${reason}`
						].join('\n'), components: [] });

						const caseInfo = {
							channel: message.channel.id,
							moderator: message.author.id,
							date: Date.now(),
							type: 'ban',
							case: guildData.casesCount,
							reason
						};

						memberData.sanctions.push(caseInfo);
						memberData.save();

						guildData.casesCount++;
						guildData.save();

						if (guildData.autoDeleteModCommands) {
							message.delete();
						}

						if (guildData.plugins.moderations) {
							const sendChannel = message.guild.channels.cache.get(guildData.plugins.moderations);
							if (!sendChannel) return;

							const embed = new MessageEmbed()
								.setColor(Colors.RED)
								.setAuthor(`Actioned by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
								.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
								.setDescription([
									`***Member:*** ${member.user.tag} (\`${member.user.id}\`)`,
									`***Action:*** Ban`,
									`***Reason:*** ${reason}`
								].join('\n'))
								.setFooter(`Case #${guildData.casesCount} | Powered by ${this.client.user.username}`, this.client.user.displayAvatarURL({ dynamic: true }));

							return sendChannel.send({ embeds: [embed] });
						}
					});
				}

				if (button.customId === 'cancel') {
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
