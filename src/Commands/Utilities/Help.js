const Command = require('../../Structures/Command.js');
const { Formatters: { hyperlink }, MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { Access, Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['halp'],
			description: 'Shows all available commands.',
			category: 'Utilities',
			usage: '(command)',
			cooldown: 5000
		});
	}

	async run(message, [command]) {
		const guildData = await this.client.findOrCreateGuild({ id: message.guild.id });
		const prefix = guildData ? guildData.prefix : this.client.prefix;

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter(`Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

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
				`***Usage:*** ${cmd.usage ? `\`${prefix + cmd.name} ${cmd.usage}\`` : `\`${prefix + cmd.name}\``}`
			].join('\n'));

			return message.reply({ embeds: [embed] });
		} else {
			const categories = this.client.utils.removeDuplicates(this.client.commands.map((cmd) => cmd.category)).map((dir) => {
				const getCommand = this.client.commands.filter((cmd) => cmd.category === dir)
					.map((cmd) => ({
						name: cmd.name
					}));

				return {
					directory: dir,
					commands: getCommand
				};
			});

			embed.setAuthor(`${this.client.user.username} | Help`, 'https://i.imgur.com/YxoUvH8.png');
			embed.setDescription([
				`Need more help? Come join our ${hyperlink('guild', `https://discord.gg/${Access.INVITE_CODE}`)}`,
				`The bot prefix is: \`${prefix}\`\n`,
				`***Select a category from the dropdown menu below!***`
			].join('\n'));
			embed.setFooter(`Powered by ${this.client.user.username} | Times out in 5 minutes`, message.author.avatarURL({ dynamic: true }));

			const menus = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId('help_menu')
						.setPlaceholder('Please select a category')
						.setDisabled(state)
						.addOptions(categories.map((cmd) => ({
							label: cmd.directory,
							value: cmd.directory.toLowerCase(),
							description: `Commands from ${cmd.directory} category`
						})))
				)
			];

			const msg = await message.reply({ embeds: [embed], components: menus(false) });

			const filter = (interaction) => interaction.user.id === message.author.id;
			const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 300000 });

			collector.on('collect', async (interaction) => {
				const [directory] = interaction.values;
				const category = categories.find((cmd) => cmd.directory.toLowerCase() === directory);

				const replyEmbed = new MessageEmbed()
					.setColor(Color.DEFAULT)
					.setAuthor(`Category | ${directory === 'nsfw' ? directory.toUpperCase() : directory.toProperCase()}`, 'https://i.imgur.com/YxoUvH8.png')
					.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
					.setDescription([
						`Need more help? Come join our ${hyperlink('guild', `https://discord.gg/${Access.INVITE_CODE}`)}`,
						`The bot prefix is: \`${prefix}\`\n`,
						`***Available commands***`,
						`${category.commands.map((cmd) => `\`${cmd.name}\``).join(' ')}`
					].join('\n'))
					.setFooter(`Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

				await interaction.deferReply({ ephemeral: true });
				return interaction.editReply({ embeds: [replyEmbed] });
			});

			collector.on('end', () => {
				embed.setFooter(`Powered by ${this.client.user.username} | Timed out`, message.author.avatarURL({ dynamic: true }));
				return msg.edit({ embeds: [embed], components: menus(true) });
			});
		}
	}

};
