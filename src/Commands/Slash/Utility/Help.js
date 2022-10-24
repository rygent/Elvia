import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { parseEmoji } from 'discord.js';
import { Colors, Emojis, Links } from '../../../Utils/Constants.js';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['help'],
			description: 'View help.'
		});
	}

	async run(interaction) {
		let i0 = 0;
		let i1 = 8;
		let page = 1;

		const appCommand = await this.client.application?.commands.fetch();
		const command = this.client.interactions
			.filter(({ name, ownerOnly }) => name[0] === String(name[0]).toLowerCase() && !ownerOnly)
			.map(({ name, description }) => ({
				id: appCommand.find(item => item.name === name[0]).id,
				name: name.join(' '),
				description
			}));

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: `${this.client.user.username} | Help`, iconURL: 'https://i.imgur.com/YxoUvH8.png' })
			.setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
			.setDescription([
				`Welcome to help menu, here is the list of commands!`,
				`Need more help? Come join our [support server](${Links.SupportServer}).\n`,
				command.sort((a, b) => a.name.localeCompare(b.name))
					.map(cmd => `</${cmd.name}:${cmd.id}>\n${Emojis.Reply} ${cmd.description}`)
					.slice(0, 8).join('\n')
			].join('\n'))
			.setFooter({ text: `Powered by ${this.client.user.username} | Page ${page} of ${Math.ceil(command.length / 8)}`, iconURL: interaction.user.avatarURL() });

		const [backwardId, previousId, nextId, forwardId] = ['backward', 'previous', 'next', 'forward'].map(id => `${id}-${nanoid()}`);
		const button = (state) => new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(backwardId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Backward))
					.setDisabled(state),
				new ButtonBuilder()
					.setCustomId(previousId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Previous))
					.setDisabled(state),
				new ButtonBuilder()
					.setCustomId(nextId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Next))
					.setDisabled(state),
				new ButtonBuilder()
					.setCustomId(forwardId)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(parseEmoji(Emojis.Forward))
					.setDisabled(state));

		const reply = await interaction.reply({ embeds: [embed], components: [button(false)] });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 180_000 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			collector.resetTimer();

			switch (i.customId) {
				case backwardId:
					i0 -= 8 * (page - 1);
					i1 -= 8 * (page - 1);
					page -= 1 * (page - 1);

					if (i0 < 0) {
						i0 += 8 * (page - 1);
						i1 += 8 * (page - 1);
						page += 1 * (page - 1);

						return i.deferUpdate();
					}

					embed.setDescription([
						`Welcome to help menu, here is the list of commands!`,
						`Need more help? Come join our [support server](${Links.SupportServer}).\n`,
						command.sort((a, b) => a.name.localeCompare(b.name))
							.map(cmd => `</${cmd.name}:${cmd.id}>\n${Emojis.Reply} ${cmd.description}`)
							.slice(i0, i1).join('\n')
					].join('\n'));
					embed.setFooter({ text: `Powered by ${this.client.user.username} | Page ${page} of ${Math.ceil(command.length / 8)}`, iconURL: interaction.user.avatarURL() });

					return i.update({ embeds: [embed], components: [button(false)] });
				case previousId:
					i0 -= 8;
					i1 -= 8;
					page -= 1;

					if (i0 < 0) {
						i0 += 8;
						i1 += 8;
						page += 1;

						return i.deferUpdate();
					}

					embed.setDescription([
						`Welcome to help menu, here is the list of commands!`,
						`Need more help? Come join our [support server](${Links.SupportServer}).\n`,
						command.sort((a, b) => a.name.localeCompare(b.name))
							.map(cmd => `</${cmd.name}:${cmd.id}>\n${Emojis.Reply} ${cmd.description}`)
							.slice(i0, i1).join('\n')
					].join('\n'));
					embed.setFooter({ text: `Powered by ${this.client.user.username} | Page ${page} of ${Math.ceil(command.length / 8)}`, iconURL: interaction.user.avatarURL() });

					return i.update({ embeds: [embed], components: [button(false)] });
				case nextId:
					i0 += 8;
					i1 += 8;
					page += 1;

					if (i1 > command.length + 8) {
						i0 -= 8;
						i1 -= 8;
						page -= 1;

						return i.deferUpdate();
					}

					if (!i0 || !i1) {
						i0 -= 8;
						i1 -= 8;
						page -= 1;

						return i.deferUpdate();
					}

					embed.setDescription([
						`Welcome to help menu, here is the list of commands!`,
						`Need more help? Come join our [support server](${Links.SupportServer}).\n`,
						command.sort((a, b) => a.name.localeCompare(b.name))
							.map(cmd => `</${cmd.name}:${cmd.id}>\n${Emojis.Reply} ${cmd.description}`)
							.slice(i0, i1).join('\n')
					].join('\n'));
					embed.setFooter({ text: `Powered by ${this.client.user.username} | Page ${page} of ${Math.ceil(command.length / 8)}`, iconURL: interaction.user.avatarURL() });

					return i.update({ embeds: [embed], components: [button(false)] });
				case forwardId:
					i0 += 8 * (Math.ceil(command.length / 8) - page);
					i1 += 8 * (Math.ceil(command.length / 8) - page);
					page += 1 * (Math.ceil(command.length / 8) - page);

					if (i1 > command.length + 8) {
						i0 -= 8 * (Math.ceil(command.length / 8) - page);
						i1 -= 8 * (Math.ceil(command.length / 8) - page);
						page -= 1 * (Math.ceil(command.length / 8) - page);

						return i.deferUpdate();
					}

					if (!i0 || !i1) {
						i0 -= 8 * (Math.ceil(command.length / 8) - page);
						i1 -= 8 * (Math.ceil(command.length / 8) - page);
						page -= 1 * (Math.ceil(command.length / 8) - page);

						return i.deferUpdate();
					}

					embed.setDescription([
						`Welcome to help menu, here is the list of commands!`,
						`Need more help? Come join our [support server](${Links.SupportServer}).\n`,
						command.sort((a, b) => a.name.localeCompare(b.name))
							.map(cmd => `</${cmd.name}:${cmd.id}>\n${Emojis.Reply} ${cmd.description}`)
							.slice(i0, i1).join('\n')
					].join('\n'));
					embed.setFooter({ text: `Powered by ${this.client.user.username} | Page ${page} of ${Math.ceil(command.length / 8)}`, iconURL: interaction.user.avatarURL() });

					return i.update({ embeds: [embed], components: [button(false)] });
			}
		});

		collector.on('end', (collected, reason) => {
			if ((!collected.size && reason === 'time') || reason === 'time') {
				return interaction.editReply({ components: [button(true)] });
			}
		});
	}

}
