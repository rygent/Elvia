import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['untimeout'],
			description: 'Remove timeout from a member.',
			memberPermissions: ['ModerateMembers'],
			clientPermissions: ['ModerateMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('member', true);
		const reason = interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot remove a timeout from a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.moderatable) return interaction.reply({ content: `I cannot remove a timeout from a member who has a higher or equal role than mine.`, ephemeral: true });

		const [cancelId, executeId] = ['cancel', 'execute'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(executeId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Remove'));

		const reply = await interaction.reply({ content: `Do you really want to remove timeout **${member.user.tag}** ?`, components: [button], ephemeral: true });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15_000, max: 1 });

		collector.on('ignore', (i) => i.deferUpdate());
		collector.on('collect', async (i) => {
			if (i.customId === cancelId) {
				return i.update({ content: `Cancelled remove timeout for user **${member.user.tag}**.`, components: [] });
			} else if (i.customId === executeId) {
				await member.timeout(null, reason);

				const replies = [
					`**${member.user.tag}** is no longer timed out!`,
					...reason ? [`***Reason:*** ${reason}`] : []
				].join('\n');

				interaction.channel.send({ content: replies });
				return i.update({ content: `Successfully removed timeout **${member.user.tag}**.`, components: [] });
			}
		});

		collector.on('end', (collected) => {
			if (!collected.size) {
				return interaction.editReply({ content: 'Action timer ran out.', components: [] });
			}
		});
	}

}
