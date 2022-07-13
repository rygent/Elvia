import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { nanoid } from 'nanoid';
import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['kick'],
			description: 'Kick a member with optional reason.',
			memberPermissions: ['KickMembers'],
			clientPermissions: ['KickMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('member', true);
		const reason = interaction.options.getString('reason');

		const member = await interaction.guild.members.cache.get(user.id);
		if (!member) return interaction.reply({ content: 'Member not found, please verify that this user is a server member.', ephemeral: true });

		if (member.user.id === interaction.user.id) return interaction.reply({ content: `You can't kick yourself.`, ephemeral: true });
		if (member.user.id === this.client.user.id) return interaction.reply({ content: `You cannot kick me!`, ephemeral: true });
		if (member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot kick a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (!member.kickable) return interaction.reply({ content: `I cannot kick a member who has a higher or equal role than mine.`, ephemeral: true });

		const [cancelId, executeId] = ['cancel', 'execute'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(executeId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Kick'));

		const reply = await interaction.reply({ content: `Do you really want to kick **${member.user.tag}** ?`, components: [button], ephemeral: true });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15_000, max: 1 });

		collector.on('collect', async (i) => {
			if (i.customId === cancelId) {
				return i.update({ content: `Cancelled kick on **${member.user.tag}**.`, components: [] });
			} else if (i.customId === executeId) {
				await interaction.guild.members.kick(member, reason);

				const replies = [
					`**${member.user.tag}** was kicked!`,
					...reason ? [`***Reason:*** ${reason}`] : []
				].join('\n');

				interaction.channel.send({ content: replies });
				return i.update({ content: `Successfully kicked **${member.user.tag}**.`, components: [] });
			}
		});

		collector.on('ignore', (i) => i.deferUpdate());

		collector.on('end', (collected) => {
			if (!collected.size) {
				return interaction.editReply({ content: 'Action timer ran out.', components: [] });
			}
		});
	}

}
