const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Resolver = require('../../Modules/Resolver.js');

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

	async run(message, [target, ...args], data) {
		const member = await Resolver.resolveMember({ message, target });
		if (!member) return message.reply({ content: 'Please specify a valid member to ban!' });

		if (!member.bannable) return message.reply({ content: `I can't banned **${member.displayName}**! For having a higher role than mine!` });
		if (message.guild.members.cache.get(message.author.id).roles.highest.position <= message.guild.members.cache.get(member.id).roles.highest.position) {
			return message.reply({ content: 'You can\'t ban a member who has an higher or equal role hierarchy to yours!' });
		}

		const reason = args.join(' ');
		if (!reason) return message.reply({ content: 'Please enter a reason!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setCustomId('confirm')
				.setLabel('Yep!'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('cancel')
				.setLabel('Cancel'));

		const m = await message.reply({ content: `Please confirm if you want to ban **${member.displayName}**!`, components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then(async (interaction) => {
			switch (interaction.customId) {
				case 'confirm': {
					if (!member.user.bot) {
						await member.send({ content: [
							`Hello **${member.user.username}**, You've just been banned from _${message.guild.name}_ by _${message.author.tag}_!`,
							`***Reason:*** ${reason}`
						].join('\n') });
					}

					message.guild.members.ban(member, { reason: `${message.author.tag}: ${reason}` }).then(async () => {
						interaction.update({ content: [
							`**${member.displayName}** has been successfully banned from this guild!`,
							`***Reason:*** ${reason}`
						].join('\n'), components: [] });

						const caseInfo = {
							channel: message.channel.id,
							moderator: message.author.id,
							date: Date.now(),
							type: 'ban',
							case: data.guild.casesCount,
							reason
						};

						data.member.sanctions.push(caseInfo);
						data.member.save();

						data.guild.casesCount++;
						await data.guild.save();

						if (data.guild.autoDeleteModCommands) {
							message.delete();
						}

						if (data.guild.plugins.moderations) {
							const sendChannel = message.guild.channels.cache.get(data.guild.plugins.moderations);
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
								.setFooter(`Case #${data.guild.casesCount}  •  Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

							return sendChannel.send({ embeds: [embed] });
						}
					});
					break;
				}
				case 'cancel': {
					return m.delete();
				}
			}
		}).catch(() => m.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
