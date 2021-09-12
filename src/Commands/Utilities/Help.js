const Command = require('../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const { Access, Color } = require('../../Utils/Setting.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Shows all available commands.',
			category: 'Utilities',
			usage: '(command)',
			cooldown: 3000
		});
	}

	async run(message, [command], data) {
		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`${this.client.user.username} | Commands`, 'https://i.imgur.com/YxoUvH8.png')
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) return message.reply({ content: `Invalid Command named. \`${command}\`` });

			embed.setAuthor(`Commands | ${cmd.name.toProperCase()}`, 'https://i.imgur.com/YxoUvH8.png');
			embed.setDescription([
				`Command Parameters: \`[]\` is strict & \`()\` is optional\n`,
				`***Aliases:*** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases.'}`,
				`***Description:*** ${cmd.description}`,
				`***Category:*** ${cmd.category}`,
				`***Permission:*** ${cmd.memberPerms.toArray().length > 0 ? `${cmd.memberPerms.toArray().map((perm) => `\`${this.client.utils.formatPerms(perm)}\``).join(', ')}` : 'No permission required.'}`,
				`***Cooldown:*** \`${cmd.cooldown / 1000}\` seconds`,
				`***Usage:*** \`${`${data.guild?.prefix}${cmd.name} ${cmd.usage || ''}`.trim()}\``
			].join('\n'));

			return message.reply({ embeds: [embed] });
		} else {
			embed.setDescription([
				`These are the available commands for ${this.client.user.username}.`,
				`Need more help? Come join our [guild](https://discord.gg/${Access.InviteCode})`,
				`The bot prefix is: \`${data.guild?.prefix}\``
			].join('\n'));

			const categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));

			for (const category of categories) {
				const dir = this.client.commands.filter(cmd => cmd.category === category);
				if (this.client.utils.categoryCheck(category, message)) {
					embed.addField(`__${category}__ (${dir.size})`, this.client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
				}
			}

			return message.reply({ embeds: [embed] });
		}
	}

};
