const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { Colors, Emojis } = require('../../../structures/Configuration.js');
const { categoryCheck, checkOwner } = require('../../../utils/HelpHandling.js');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'help',
			aliases: ['halp', 'commands'],
			description: 'Displays all commands that the bot has.',
			category: 'information',
			usage: '[command | alias]',
			guildOnly: true,
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
		});
	}

	async run(message, args) {
		try {
			const roleColor = message.guild.me.roles.highest.hexColor;

			const embed = new MessageEmbed()
				.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
				.setAuthor(`${this.client.user.username} | Commands`, 'https://i.imgur.com/YxoUvH8.png')
				.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));

			if (!args[0] || (checkOwner(message.author.id) && args[0] === 'all')) {
				const categories = readdirSync('./src/modules/commands/');

				embed.setDescription(`These are the avaliable commands for ${this.client.user.username}.\nThe bot prefix is: **${this.client.PREFIX}**`);
				embed.setFooter(`Responded in ${this.client.functions.responseTime(message)} | ${this.client.commands.size} commands`, message.author.avatarURL({ dynamic: true }));

				categories.forEach(cat => {
					const dir = this.client.commands.filter(cmd => cmd.category === cat);
					if (args[0] === 'all' || categoryCheck(cat, message, this.client)) {
						embed.addField(`${Emojis.Categories[cat.toUpperCase()] || null}  __${cat.toProperCase()} [${dir.size}]__`, dir.map(cmd => `\`${cmd.name}\``).join(', '));
					}
				});

				const diduknow = [
					`commands usually have aliases? Just execute the command \`${this.client.PREFIX}help <command>\` to check them!`,
					"most of the people don't read the helpful tricks that are here?"
				];

				embed.addField('__Did you know that__', diduknow.random());

				message.channel.send(embed);
			} else {
				const command = this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());
				if (!command) {
					message.channel.send(embed.setTitle('Invalid Command.').setDescription(`Do \`${this.client.PREFIX}help\` for the list of the commands.`));
				}

				embed.setAuthor(`Commands | ${command.name.toProperCase()}`, 'https://i.imgur.com/YxoUvH8.png');
				embed.setDescription(stripIndents` The bot's prefix is: \`${this.client.PREFIX}\`\n
                    ***Command:*** ${command.name}
                    ***Aliases:*** ${command.aliases.length > 0 ? command.aliases.join(', ') : 'No aliases.'}
                    ***Description:*** ${command.description}
                    ***Category:*** ${command.category.toProperCase()}
					***Usage:*** ${command.usage ? `\`${this.client.PREFIX}${command.name} ${command.usage}\`` : `\`${this.client.PREFIX}${command.name}\``}
					***Permissions:*** \`${command.ownerOnly ? 'OWNER' : command.memberPerms.length > 0 ? command.memberPerms.map(arr => arr).join(', ') : 'EVERYONE'}\``);
				embed.setFooter('Syntax: <> = required, [] = optional', message.author.avatarURL({ dynamic: true }));

				message.channel.send(embed);
			}
		} catch (err) {
			console.log(err);
		}
	}

};
