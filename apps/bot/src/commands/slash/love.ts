import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/constants.js';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'love',
			description: 'Calculate love percentage between two users.',
			options: [
				{
					name: '1st',
					description: '1st user.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: '2nd',
					description: '2nd user.',
					type: ApplicationCommandOptionType.User,
					required: true
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
			category: 'Fun',
			guild: true
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const user1 = interaction.options.getMember('1st') as GuildMember;
		const user2 = interaction.options.getMember('2nd') as GuildMember;

		const percentage = Math.random();
		const estimated = Math.ceil(percentage * 1e2);

		let result: string;
		if (estimated < 45) {
			result = 'Try again next time...';
		} else if (estimated < 75) {
			result = 'Good enough!';
		} else if (estimated < 1e2) {
			result = 'Good match!';
		} else {
			result = 'Perfect match!';
		}

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setThumbnail('https://twemoji.maxcdn.com/72x72/1f49e.png')
			.setDescription(
				[
					`${user1} is ${estimated}% in love with ${user2}`,
					`${inlineCode('█'.repeat(Math.round(percentage * 30)).padEnd(30, '\u00A0'))}\n`,
					`${bold(italic('Result:'))} ${result}`
				].join('\n')
			)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed] });
	}
}
