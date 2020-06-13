/* eslint-disable func-names */
const { MessageEmbed } = require('discord.js');
const { Colors } = require('./Configuration.js');
const { responseTime } = require('./Functions.js');

module.exports = {
	generals: async function (type, message, args) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
			.setFooter(`Responded in ${responseTime(message)}`, message.author.avatarURL({ dynamic: true }))
			.setTimestamp();
		switch (type) {
			default: {
				embed.setDescription(`**${message.author.tag}**, ${args}`);
			}
		}
		message.channel.send(embed);
	},
	errors: async function (type, message, args) {
		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle('Error!')
			.setFooter(`Responded in ${responseTime(message)}`);
		switch (type) {
			case 'guildOnly': {
				embed.setDescription(`💢 **${message.author.tag}**, This command is only available on a server!`);
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
			default: {
				embed.setDescription(`💢 **${message.author.tag}**, ${args}`);
			}
		}
		if (message.author.avatarURL !== null) {
			embed.setFooter(`Responded in ${responseTime(message)}`, message.author.avatarURL({ dynamic: true }));
		}
		message.channel.send(embed);
	}
};
