const Command = require('../../../structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Colors, Default } = require('../../../structures/Configuration.js');
const { categoryCheck } = require('../../../utils/HelpHandling.js');
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
			clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 3000
		});
	}

	async run(message, [command]) {
		const roleColor = message.guild.me.roles.highest.hexColor;

		const embed = new MessageEmbed()
			.setColor(roleColor === '#000000' ? Colors.DEFAULT : roleColor)
			.setAuthor(`${this.client.user.username} | Commands`, 'https://i.imgur.com/YxoUvH8.png')
			.setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
			.setFooter(`Responded in ${this.client.functions.responseTime(message)}`, message.author.avatarURL({ dynamic: true }));

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

			embed.setAuthor(`Commands | ${cmd.name.toProperCase()}`, 'https://i.imgur.com/YxoUvH8.png');
			embed.setDescription(stripIndents`
				Command Parameters: \`<>\` is strict & \`[]\` is optional\n
				***Aliases:*** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases.'}
				***Description:*** ${cmd.description}
				***Category:*** ${cmd.category.toProperCase()}
				***Permissions:*** \`${cmd.ownerOnly ? 'OWNER' : cmd.memberPerms.length > 0 ? cmd.memberPerms.map(arr => arr).join(', ') : 'EVERYONE'}\`
				***Usage:*** ${cmd.usage ? `\`${Default.PREFIX}${cmd.name} ${cmd.usage}\`` : `\`${Default.PREFIX}${cmd.name}\``}
				***Cooldown:*** ${cmd.cooldown / 1000} seconds`
			);

			return message.channel.send(embed);
		} else {
			embed.setDescription(`These are the avaliable commands for ${this.client.user.username}.\nThe bot prefix is: **${Default.PREFIX}**`);
			embed.setFooter(`Responded in ${this.client.functions.responseTime(message)} | ${this.client.commands.size} commands`, message.author.avatarURL({ dynamic: true }));

			const categories = this.client.functions.removeDuplicates(this.client.commands.map(cmd => cmd.category));

			for (const category of categories) {
				const dir = this.client.commands.filter(cmd => cmd.category === category);
				if (categoryCheck(category, message)) {
					embed.addField(`⟐ __${category.toProperCase()} | ${dir.size}__`, this.client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
				}
			}

			const diduknow = [
				`commands usually have aliases? Just execute the command \`${Default.PREFIX}help <command>\` to check them!`,
				"most of the people don't read the helpful tricks that are here?"
			];

			embed.addField('__Did you know that__', diduknow.random());

			return message.channel.send(embed);
		}
	}

};
