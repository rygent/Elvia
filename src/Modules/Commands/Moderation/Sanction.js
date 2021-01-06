const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['warns', 'infractions'],
			description: 'Displays the list of infractions committed by a member!',
			category: 'Moderation',
			usage: '<@member>',
			userPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	/* eslint-disable consistent-return */
	async run(message, [target]) {
		const user = await this.client.resolveUser(target);
		if (!user) return message.quote('You must specify a member!');

		const memberData = await this.client.findOrCreateMember({ id: user.id, guildID: message.guild.id });
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor(`Sanctions of ${user.username}`, user.avatarURL({ dynamic: true }))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		if (memberData.sanctions.length < 1) {
			embed.setDescription(`**${user.tag}** did not receive any sanctions.`);
			return message.channel.send(embed);
		} else {
			memberData.sanctions.forEach((sanction) => {
				embed.addField(`${sanction.type.toProperCase()} | Case #${sanction.case}`, [
					`***Moderator:*** <@${sanction.moderator}>`,
					`***Reason:*** ${sanction.reason}`
				].join('\n'));
			});
		}

		return message.channel.send(embed);
	}

};
