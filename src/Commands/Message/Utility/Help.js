import Command from '../../../Structures/Command.js';
import { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from '@discordjs/builders';
import { ComponentType } from 'discord-api-types/v10';
import { Colors, Links } from '../../../Utils/Constants.js';
import { formatPermissions, isRestrictedChannel } from '../../../Structures/Util.js';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'help',
			aliases: ['h'],
			description: 'View help.',
			category: 'Utility',
			usage: '(command)',
			disabled: true
		});
	}

	async run(message, [command]) {
		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: message.author.avatarURL() });

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
			if (!cmd) return message.reply({ content: `There is not a command named \`${command}\`. Try searching something else.` });

			embed.setAuthor({ name: `Command | ${cmd.name.toTitleCase()}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Command Parameters: \`[]\` is strict & \`()\` is optional\n`,
				`***Aliases:*** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases.'}`,
				`***Description:*** ${cmd.description}`,
				`***Category:*** ${cmd.category}`,
				`***Permission(s):*** ${cmd.memberPermissions.toArray().length > 0 ? `${cmd.memberPermissions.toArray().map(perm => `\`${formatPermissions(perm)}\``).join(', ')}` : 'No permission required.'}`,
				`***Cooldown:*** ${cmd.cooldown / 1000} second(s)`,
				`***Usage:*** ${cmd.usage ? `\`${this.client.prefix + cmd.name} ${cmd.usage}\`` : `\`${this.client.prefix + cmd.name}\``}`
			].join('\n'));

			return message.reply({ embeds: [embed] });
		} else {
			const categories = [...new Set(this.client.commands.map(cmd => cmd.category))].map(dir => {
				const getCommand = this.client.commands.filter(cmd => cmd.category === dir)
					.map(cmd => ({
						name: cmd.name
					}));

				return {
					directory: dir,
					commands: getCommand
				};
			});

			embed.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
			embed.setDescription([
				`Need more help? Come join our [guild](${Links.SupportServer})`,
				`The bot prefix is: \`${this.client.prefix}\``
			].join('\n'));

			const selectId = `select-${nanoid()}`;
			const select = (state) => new ActionRowBuilder()
				.addComponents(new SelectMenuBuilder()
					.setCustomId(selectId)
					.setPlaceholder('Select a category!')
					.setDisabled(state)
					.addOptions(...categories.filter(({ directory }) => this.filterCategory(directory, message)).map(({ directory }) => ({
						value: directory.toLowerCase(),
						label: directory,
						description: `Shows all the ${directory} Commands`
					}))));

			const reply = await message.reply({ embeds: [embed], components: [select(false)] });

			const filter = (i) => i.user.id === message.author.id;
			const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 60_000 });

			collector.on('collect', async (i) => {
				collector.resetTimer();

				const [selected] = i.values;
				const category = categories.find(({ directory }) => directory.toLowerCase() === selected);

				embed.setAuthor({ name: `Category | ${category.directory}`, iconURL: 'https://i.imgur.com/YxoUvH8.png' });
				embed.setFields({ name: `__Available commands__`, value: category.commands.map(({ name }) => `\`${name}\``).join(' ') });
				embed.setFooter({ text: `Powered by ${this.client.user.username} | ${category.commands.length} Commands`, iconURL: message.author.avatarURL() });

				return i.update({ embeds: [embed], components: [select(false)] });
			});

			collector.on('ignore', (i) => {
				if (i.user.id !== message.author.id) return i.deferUpdate();
			});

			collector.on('end', (collected, reason) => {
				if ((!collected.size && reason === 'time') || reason === 'time') {
					return reply.edit({ components: [select(true)] });
				}
			});
		}
	}

	filterCategory(category, message) {
		switch (category.toLowerCase()) {
			case 'developer':
				return this.client.owners.includes(message.author.id);
			case 'nsfw':
				return isRestrictedChannel(message.channel);
			default:
				return true;
		}
	}

}
