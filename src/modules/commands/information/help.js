const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { Colors } = require('../../../structures/Configuration.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'help',
			aliases: ['halp', 'commands'],
			description: 'Displays all commands that the bot has.',
			category: 'information',
			usage: '[command | alias]',
			guildOnly: true
		});
	}

	async run(message, args) {
		try {
			const roleColor = message.guild.me.roles.highest.hexColor;

			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.CUSTOM : roleColor)
				.setAuthor(`${this.client.user.username} Help`, message.guild.iconURL({ dynamic: true }))
				.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));

			if (!args[0]) {
				const categories = readdirSync('./src/modules/commands/');

				embed.setDescription(`These are the avaliable commands for ${this.client.user.username}.\nThe bot prefix is: **${this.client.PREFIX}**`);
				embed.setFooter(`Based on ${this.client.user.username} | Total Commands: ${this.client.commands.size}`, this.client.user.displayAvatarURL({ dynamic: true }));
				embed.setTimestamp();

				categories.forEach(cat => {
					const dir = this.client.commands.filter(cmd => cmd.category === cat);
					try {
						embed.addField(`⟐ __**${cat.toProperCase()} [${dir.size}]:**__`, dir.map(cmd => `\`${cmd.name}\``).join(', '));
					} catch (err) {
						console.log(err);
					}
				});

				const diduknow = [
					`commands usually have aliases? Just execute the command \`${this.client.PREFIX}help <command>\` to check them!`,
					"most of the people don't read the helpful tricks that are here?"
				];

				embed.addField('Did you know that', diduknow[Math.floor(Math.random() * diduknow.length)]);

				message.channel.send(embed);
			} else {
				const command = this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());
				if (!command) {
					message.channel.send(embed.setTitle('Invalid Command.').setDescription(`Do \`${this.client.PREFIX}help\` for the list of the commands.`));
				}

				embed.setDescription(stripIndents` The bot's prefix is: \`${this.client.PREFIX}\`\n
                    _Command:_ **${command.name.toProperCase()}**
                    _Aliases:_ **${command.aliases ? command.aliases.join(', ') : 'None'}**
                    _Description:_ **${command.description}**
                    _Category:_ **${command.category.toProperCase()}**
                    _Usage:_ ${command.usage ? `\`${this.client.PREFIX}${command.name} ${command.usage}\`` : `\`${this.client.PREFIX}${command.name}\``}`);
				embed.setFooter('Syntax: <> = required, [] = optional');
				embed.setTimestamp();

				message.channel.send(embed);
			}
		} catch (err) {
			console.log(err);
		}
	}

};
