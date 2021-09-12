const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const Resolver = require('../../Modules/Resolver.js');

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

	async run(message, [target], data) {
		const user = await Resolver.resolveUser({ message, target });
		if (!user) return message.reply({ content: 'You must specify a member\'s username!' });

		const embed = new MessageEmbed()
			.setColor(Color.YELLOW)
			.setAuthor(user.tag, user.avatarURL({ dynamic: true }))
			.setFooter(`Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		if (data.member.sanctions.length < 1) {
			return message.reply({ content: `**${user.tag}** doesn't have any warning!` });
		} else {
			data.member.sanctions.forEach((sanction) => {
				embed.addField(`${sanction.type.toProperCase()} | Case #${sanction.case}`, [
					`***Moderator:*** <@${sanction.moderator}>`,
					`***Reason:*** ${sanction.reason}`
				].join('\n'));
			});
		}

		return message.reply({ embeds: [embed] });
	}

};
