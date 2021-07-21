const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['warns', 'infractions'],
			description: 'Displays a list of violations on certain members!',
			category: 'Moderation',
			usage: '[member]',
			memberPerms: ['MANAGE_MESSAGES'],
			clientPerms: ['MANAGE_MESSAGES'],
			cooldown: 3000
		});
	}

	async run(message, [target]) {
		const user = await this.client.resolveUser(target);
		if (!user) return message.reply({ content: 'You must specify a member\'s username!' });

		const memberData = await this.client.findOrCreateMember({ id: user.id, guildID: message.guild.id });

		const embed = new MessageEmbed()
			.setColor(Color.YELLOW)
			.setAuthor(user.tag, user.avatarURL({ dynamic: true }))
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		if (memberData.sanctions.length < 1) {
			return message.reply({ content: `**${user.tag}** doesn't have any warning!` });
		} else {
			memberData.sanctions.forEach((sanction) => {
				embed.addField(`${sanction.type.toProperCase()} | Case #${sanction.case}`, [
					`***Moderator:*** <@${sanction.moderator}>`,
					`***Reason:*** ${sanction.reason}`
				].join('\n'));
			});
		}

		return message.reply({ embeds: [embed] });
	}

};
