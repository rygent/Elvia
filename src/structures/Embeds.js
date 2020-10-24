const { MessageEmbed } = require('discord.js');
const { Colors, Emojis } = require('./Configuration.js');

const ZWS = '\u200B';

module.exports = class Embeds extends MessageEmbed {

	splitFields(contentOrTitle, rawContent) {
		if (typeof contentOrTitle === 'undefined') return this;

		let title;
		let content;
		if (typeof rawContent === 'undefined') {
			title = ZWS;
			content = contentOrTitle;
		} else {
			title = contentOrTitle;
			content = rawContent;
		}

		if (Array.isArray(content)) content = content.join('\n');
		if (title === ZWS && !this.description && content.length < 2048) {
			this.description = content;
			return this;
		}

		// eslint-disable-next-line id-length
		let x;
		let slice;
		while (content.length) {
			if (content.length < 1024) {
				this.fields.push({ name: title, value: content, inline: false });
				return this;
			}

			slice = content.slice(0, 1024);
			x = slice.lastIndexOf('\n');
			if (x === -1) x = slice.lastIndexOf('');
			if (x === -1) x = 1024;

			this.fields.push({ name: title, value: content.trim().slice(0, x), inline: false });
			content = content.slice(x + 1);
			title = ZWS;
		}
		return this;
	}

	async common(type, message, args) {
		const embed = new MessageEmbed()
			.setColor(Colors.RED)
			.setTitle(`${Emojis.ERROR} | ERROR!`)
			.setFooter(`Responded in ${this.client.utils.responseTime(message)}`);
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
				embed.setDescription(`You're missing ${args} permissions, you need them to use this command.`);
				break;
			}
			case 'clientPerms': {
				embed.setTitle(`${Emojis.ERROR} | Access Denied!`);
				embed.setDescription(`I'm missing ${args} permissions, I need them to use this command.`);
				break;
			}
			case 'APIError': {
				embed.setTitle(`${Emojis.ERROR} | ERROR 404!`);
				embed.setDescription('Sorry, an API error has occured. Please try again later.');
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
			embed.setFooter(`Responded in ${this.client.utils.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));
		}
		message.channel.send(embed);
	}

	async afk(type, message, target, args) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor);
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
