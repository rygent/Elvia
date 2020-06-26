/* eslint-disable func-names */
const { MessageEmbed } = require('discord.js');
const { Colors } = require('./Configuration.js');
const { responseTime } = require('./Functions.js');

module.exports = {
	errors: async function (type, message, args) {
		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle('ERROR!')
			.setFooter(`Responded in ${responseTime(message)}`);
		switch (type) {
			case 'cooldownTime': {
				embed.setDescription(`💢 **${message.author.tag}**, You must wait **${args}** second(s) to be able to run this command again!`);
				break;
			}
			case 'ownerOnly': {
				embed.setTitle('You\'re not my master');
				embed.setDescription(`💢 **${message.author.tag}**, Only my master can do these **Command**.`);
				break;
			}
			case 'nsfwOnly': {
				embed.setTitle('NSFW!');
				embed.setDescription(`💢 **${message.author.tag}**, You must go to in a channel that allows the NSFW to type this command!`);
				break;
			}
			case 'memberPerms': {
				embed.setTitle('Insufficient Permission!');
				embed.setDescription(`💢 **${message.author.tag}**, You don't have the necessary permissions to perform this command. Required permission: \`${args}\``);
				break;
			}
			case 'clientPerms': {
				embed.setTitle('Insufficient Permission!');
				embed.setDescription(`💢 **${message.author.tag}**, I don't have the necessary permissions to perform this command. Required permission: \`${args}\``);
				break;
			}
			case 'commonError': {
				embed.setDescription(`💢 **${message.author.tag}**, ${args}`);
				break;
			}
			default: {
				embed.setDescription(`💢 **${message.author.tag}**, An error has occurred, please try again in a few minutes.`);
			}
		}
		if (message.author.avatarURL !== null) {
			embed.setFooter(`Responded in ${responseTime(message)}`, message.author.avatarURL({ dynamic: true }));
		}
		message.channel.send(embed);
	}
};
