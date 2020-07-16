const { MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('./Configuration.js');

module.exports = class Embeds {

	constructor(client) {
		this.client = client;
	}

	async errors(type, message, args) {
		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${Emojis.ERROR} | ERROR!`)
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`);
		switch (type) {
			case 'ownerOnly': {
				embed.setTitle(`${Emojis.ERROR} | You're not my master!`);
				embed.setDescription('Only my master can do these **Command**.');
				break;
			}
			case 'nsfwOnly': {
				embed.setTitle(`${Emojis.ERROR} | NSFW!`);
				embed.setDescription('You must go to in a channel that allows the NSFW to type this command!');
				break;
			}
			case 'memberPerms': {
				embed.setTitle(`${Emojis.ERROR} | Access Denied!`);
				embed.setDescription(`You don't have the necessary permissions to perform this command. Required permission: \`${args}\``);
				break;
			}
			case 'clientPerms': {
				embed.setTitle(`${Emojis.ERROR} | Access Denied!`);
				embed.setDescription(`I don't have the necessary permissions to perform this command. Required permission: \`${args}\``);
				break;
			}
			case 'commonError': {
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

};
