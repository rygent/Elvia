const { MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('./Configuration.js');

module.exports = class Embeds {

	constructor(client) {
		this.client = client;
	}

	async common(type, message, args) {
		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${Emojis.ERROR} | ERROR!`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`);
		switch (type) {
			case 'ownerOnly': {
				embed.setTitle(`${Emojis.ERROR} | You're not a developer!`);
				embed.setDescription('Only developers can use this command.');
				break;
			}
			case 'nsfwOnly': {
				embed.setTitle(`${Emojis.ERROR} | NSFW!`);
				embed.setDescription('This command can only be used on the NSFW channel, make sure the NSFW option is enabled');
				embed.setImage('https://i.imgur.com/oe4iK5i.gif');
				break;
			}
			case 'memberPerms': {
				embed.setTitle(`${Emojis.ERROR} | Access Denied!`);
				embed.setDescription(`You don't have the required permission. Permissions required: ${args}`);
				break;
			}
			case 'clientPerms': {
				embed.setTitle(`${Emojis.ERROR} | Access Denied!`);
				embed.setDescription(`I don't have the required permission. Permissions required: ${args}`);
				break;
			}
			case 'commonError': {
				embed.setDescription(args);
				break;
			}
			case 'commonSuccess': {
				embed.setColor(Colors.GREEN);
				embed.setTitle(`${Emojis.SUCCESS} | SUCCESS!`);
				embed.setDescription(args);
				break;
			}
			default: {
				embed.setDescription('An error has occurred, please try again in a few minutes.');
			}
		}
		if (message.author.avatarURL !== null) {
			embed.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));
		}
		message.channel.send(embed).then(msg => msg.delete({ timeout: 20000 }));
	}

	async afk(type, message, target, args) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setFooter(`AFK system powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));
		switch (type) {
			case 'delete': {
				embed.setDescription(`You're no longer AFK!`);
				break;
			}
			case 'current': {
				embed.setDescription(`**${target}** is currently AFK!\nReason: ${args}`);
				break;
			}
		}
		message.channel.send(embed);
	}

};
