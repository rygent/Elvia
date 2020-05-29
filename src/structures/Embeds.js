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
	}
};
