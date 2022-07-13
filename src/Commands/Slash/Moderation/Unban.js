import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { nanoid } from 'nanoid';
import Command from '../../../Structures/Interaction.js';

export default class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['unban'],
			description: 'Unban a user with optional reason.',
			memberPermissions: ['BanMembers'],
			clientPermissions: ['BanMembers']
		});
	}

	async run(interaction) {
		const user = interaction.options.getString('user', true);
		const reason = interaction.options.getString('reason');

		const banned = await interaction.guild.bans.fetch();

		const target = banned.find(member => member.user.id === user || member.user.tag === user)?.user;
		if (!target) return interaction.reply({ content: 'This user is not banned on this server.', ephemeral: true });

		const [cancelId, executeId] = ['cancel', 'execute'].map(type => `${type}-${nanoid()}`);
		const button = new ActionRowBuilder()
			.addComponents(new ButtonBuilder()
				.setCustomId(cancelId)
				.setStyle(ButtonStyle.Secondary)
				.setLabel('Cancel'))
			.addComponents(new ButtonBuilder()
				.setCustomId(executeId)
				.setStyle(ButtonStyle.Danger)
				.setLabel('Unban'));

		const reply = await interaction.reply({ content: `Do you really want to unban **${target.tag}** ?`, components: [button], ephemeral: true });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 15_000, max: 1 });

		collector.on('collect', async (i) => {
			if (i.customId === cancelId) {
				return i.update({ content: `Cancelled unban on **${target.tag}**.`, components: [] });
			} else if (i.customId === executeId) {
				await interaction.guild.members.unban(target, reason);

				const replies = [
					`**${target.tag}** was unbanned!`,
					...reason ? [`***Reason:*** ${reason}`] : []
				].join('\n');

				interaction.channel.send({ content: replies });
				return i.update({ content: `Successfully unbanned **${target.tag}**.`, components: [] });
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
