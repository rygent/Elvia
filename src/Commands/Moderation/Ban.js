const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Ban certain users from the server!',
			category: 'Moderation',
			usage: '[member] [reason]',
			memberPerms: ['BAN_MEMBERS'],
			clientPerms: ['BAN_MEMBERS'],
			cooldown: 3000
		});
	}

	async run(message, [target, ...args]) {
		const member = await this.client.resolveMember(target, message.guild);
		if (!member) return message.reply({ content: 'Please specify a valid member to ban!' });

		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const memberData = await this.client.findOrCreateMember({ id: member.id, guildID: message.guild.id });

		if (!member.bannable) return message.reply({ content: `I can't banned **${member.displayName}**! For having a higher role than mine!` });
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply({ content: 'You can\'t ban a member who has an higher or equal role hierarchy to yours!' });
		}

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Confirm')
				.setCustomId('confirm'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setLabel('Cancel')
				.setCustomId('cancel'));

		return message.reply({ content: `Please confirm if you want to ban **${member.displayName}**!`, components: [button] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			msg.awaitMessageComponent({ filter, time: 15000 }).then(async (button) => {
				switch (button.customId) {
					case 'confirm': {
						if (!member.user.bot) {
							await member.send({ content: [
								`Hello **${member.user.username}**, You've just been banned from _${message.guild.name}_ by _${message.author.tag}_!`,
								`***Reason:*** ${reason}`
							].join('\n') });
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
									.setColor(Color.RED)
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
						break;
					}
					case 'cancel': {
						return button.update({ content: 'Command has been cancelled!', components: [] });
					}
				}
			}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
		});
	}

};
