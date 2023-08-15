import type BaseClient from '#lib/BaseClient.js';
import Command from '#lib/structures/Interaction.js';
import type { ChatInputCommandInteraction, ForumChannel, TextChannel, VoiceChannel } from 'discord.js';
import { bold, channelMention, italic } from '@discordjs/formatters';
import { Duration, DurationFormatter } from '@sapphire/time-utilities';

export default class extends Command {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'slowmode',
			description: 'Applies a slowmode to a channel.',
			category: 'Manage',
			memberPermissions: ['ManageChannels'],
			clientPermissions: ['ManageChannels'],
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const duration = interaction.options.getString('duration', true);
		const channel =
			(interaction.options.getChannel('channel') as TextChannel | VoiceChannel | ForumChannel) ?? interaction.channel;
		const reason = interaction.options.getString('reason');
		const visible = interaction.options.getBoolean('visible') ?? false;

		const { offset } = new Duration(duration);
		if (offset > 216e5) {
			return interaction.reply({
				content: 'Slowmode time must be a number between 0 second and 6 hours.',
				ephemeral: true
			});
		}

		await interaction.deferReply({ ephemeral: !visible });
		await channel?.setRateLimitPerUser(offset / 1e3, reason as string);

		const time = new DurationFormatter();

		const replies = [
			`${channelMention(channel.id)} slowmode was updated,`,
			`it is now set to ${bold(time.format(offset))}.`,
			...(reason ? [`${bold(italic('Reason:'))} ${reason}`] : [])
		].join('\n');

		return interaction.editReply({ content: replies });
	}
}
