const Command = require('../../../Structures/Command');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { ComponentType } = require('discord-api-types/v9');
const { Access, Colors } = require('../../../Utils/Constants');
const { nanoid } = require('nanoid');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['h'],
			description: 'View help.',
			category: 'Utility',
			usage: '(command)'
		});
	}

	async run(message, [command]) {
		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) return message.reply({ content: `Invalid Command named. \`${command}\`` });

			embed.setAuthor({ name: `Commands | ${cmd.name.toProperCase()}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Command Parameters: \`[]\` is strict & \`()\` is optional\n`,
				`***Aliases:*** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases.'}`,
				`***Description:*** ${cmd.description}`,
				`***Category:*** ${cmd.category}`,
				`***Permission(s):*** ${cmd.memberPermission.toArray().length > 0 ? `${cmd.memberPermission.toArray().map((perm) => `\`${this.client.utils.formatPermissions(perm)}\``).join(', ')}` : 'No permission required.'}`,
				`***Usage:*** ${cmd.usage ? `\`${this.client.prefix + cmd.name} ${cmd.usage}\`` : `\`${this.client.prefix + cmd.name}\``}`
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

			embed.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Need more help? Come join our [guild](${Access.InviteLink})`,
				`The bot prefix is: \`${this.client.prefix}\``
			].join('\n'));

			const selectId = `select-${nanoid()}`;
			const select = (state) => new MessageActionRow()
				.addComponents(new MessageSelectMenu()
					.setCustomId(selectId)
					.setPlaceholder('Select a category!')
					.setDisabled(state)
					.addOptions(categories.filter(x => this.client.utils.filterCategory(x.directory, message)).map((cmd) => ({
						label: cmd.directory,
						value: cmd.directory.toLowerCase()
					}))));

			return message.reply({ embeds: [embed], components: [select(false)] }).then(msg => {
				const filter = (i) => i.customId === selectId;
				const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

				collector.on('collect', async (i) => {
					if (i.user.id !== message.author.id) return i.deferUpdate();
					await i.deferUpdate();

					const [directory] = i.values;
					const category = categories.find((cmd) => cmd.directory.toLowerCase() === directory);

					embed.setAuthor({ name: `Category | ${category.directory}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
					embed.setFields([{ name: '\u200B', value: category.commands.map((cmd) => `\`${cmd.name}\``).join(' ') }]);

					collector.resetTimer();
					return i.editReply({ embeds: [embed], components: [select(false)] });
				});

				collector.on('end', (collected, reason) => {
					if ((collected.size === 0 || collected.filter(x => x.user.id === message.author.id).size === 0) && reason === 'time') {
						return msg.delete();
					} else if (reason === 'time') {
						return msg.edit({ components: [select(true)] });
					}
				});
			});
		}
	}

};
