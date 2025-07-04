import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ChannelType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import {
	PermissionsBitField,
	type ChatInputCommandInteraction,
	type ForumChannel,
	type TextChannel,
	type VoiceChannel
} from 'discord.js';
import { bold, channelMention, italic } from '@discordjs/formatters';
import { Duration, DurationFormatter } from '@sapphire/time-utilities';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'slowmode',
			description: 'Applies a slowmode to a channel.',
			options: [
				{
					name: 'duration',
					description: 'Duration of the slowmode. (Example: 2 hours)',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'channel',
					description: 'Channel to set slowmode in. (Defaults to current channel)',
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildForum],
					required: false
				},
				{
					name: 'reason',
					description: 'Reason of the slowmode.',
					type: ApplicationCommandOptionType.String,
					max_length: 500,
					required: false
				},
				{
					name: 'visible',
					description: 'Whether the replies should be visible in the channel.',
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			defaultMemberPermissions: new PermissionsBitField(['ManageChannels']).bitfield.toString(),
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Manage',
			clientPermissions: ['ManageChannels'],
			userPermissions: ['ManageChannels'],
			guild: true
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
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.deferReply({ flags: !visible ? MessageFlags.Ephemeral : undefined });
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
