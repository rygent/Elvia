const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'invite',
			aliases: [],
			description: 'Gives you the invite link!',
			category: 'information'
		});
	}

	async run(message) {
		let roleColor;
		if (!message.guild) {
			roleColor = Colors.DEFAULT;
		} else {
			roleColor = message.guild.me.roles.highest.hexColor;
		}

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setTitle('__Invitation Link__')
			.setDescription(stripIndents`
                Here is the bot invite link and support server invite link!
                [Invite ${this.client.user.username}](https://discordapp.com/oauth2/authorize?&client_id=${this.client.user.id}&scope=bot&permissions=1043721303)
                [Support Server](https://discord.gg/nW6x9EN)`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send(embed);
	}

};
