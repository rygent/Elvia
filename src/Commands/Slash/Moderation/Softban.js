import Command from '../../../Structures/Interaction.js';
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { nanoid } from 'nanoid';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['softban'],
			description: 'Softban a user. (Bans and unbans to clear up the user\'s messages.)',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason');
		const days = interaction.options.getInteger('days');

		if (user.id === interaction.user.id) return interaction.reply({ content: `You can't ban yourself.`, ephemeral: true });
		if (user.id === this.client.user.id) return interaction.reply({ content: `You cannot ban me!`, ephemeral: true });

		const member = interaction.guild.members.cache.get(user.id);
		if (member && member.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0) {
			return interaction.reply({ content: 'You cannot ban a member who has a higher or equal role than yours.', ephemeral: true });
		}
		if (member && !member.bannable) return interaction.reply({ content: `I cannot ban a member who has a higher or equal role than mine.`, ephemeral: true });

		const [cancelId, executeId] = ['cancel', 'execute'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(executeId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Softban'));

		const reply = await interaction.reply({ content: `Do you really want to softban **${user.tag}** ?`, components: [button], ephemeral: true });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15_000, max: 1 });

		collector.on('collect', async (i) => {
			if (i.customId === cancelId) {
				return i.update({ content: `Cancelled softban on **${user.tag}**.`, components: [] });
			} else if (i.customId === executeId) {
				await interaction.guild.members.ban(user, { deleteMessageDays: days || 1, reason });
				await interaction.guild.members.unban(user, reason);

				const replies = [
					`**${user.tag}** was softbanned!`,
					...reason ? [`***Reason:*** ${reason}`] : []
				].join('\n');

				interaction.channel.send({ content: replies });
				return i.update({ content: `Successfully softbanned **${user.tag}**.`, components: [] });
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
