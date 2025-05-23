import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ContainerBuilder, SeparatorBuilder, TextDisplayBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { bold, inlineCode, italic, subtext } from '@discordjs/formatters';

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

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					[
						`${user1} is ${estimated}% in love with ${user2}`,
						`${inlineCode('█'.repeat(Math.round(percentage * 50)).padEnd(50, '\u00A0'))}\n`,
						`${bold(italic('Result:'))} ${result}`
					].join('\n')
				)
			)
			.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(subtext(`Powered by ${bold(this.client.user.username)}`))
			);

		return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
	}
}
