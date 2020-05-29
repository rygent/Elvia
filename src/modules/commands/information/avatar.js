const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			aliases: ['av'],
			description: 'Displays bot latency and API response times.',
			category: 'Information'
		});
	}

	async run(message, args) {
		const msg = await message.channel.send('Generating...');
		let user = await this.client.resolveUser(args[0]);
		if (!user) user = message.author;
		msg.delete();

		const roleColor = message.guild.me.roles.highest.hexColor;

		const avatarEmbed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setTitle('🖼️ Avatars')
			.setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }))
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		if (message.content.includes('-hd')) {
			avatarEmbed.addField(`${user.tag}`, stripIndents`
            \`ID: ${user.id}\`
            **[HD Resolution](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})**`);
		} else {
			avatarEmbed.addField(`${user.tag}`, stripIndents`
            \`ID: ${user.id}\``);
		}

		message.channel.send(avatarEmbed);
	}

};
