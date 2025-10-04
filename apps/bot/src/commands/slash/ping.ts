import { CoreCommand, type CoreClient } from '@elvia/core';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import { type ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';

export default class extends CoreCommand {
	public constructor(client: CoreClient<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'ping',
			description: 'Send a ping request.',
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'General'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const replies = [
			`${bold(italic('Websocket:'))} ${inlineCode(`${Math.round(this.client.ping!)}ms`)}`,
			`${bold(italic('Latency:'))} ${inlineCode(`${Math.round(Date.now() - interaction.createdTimestamp)}ms`)}`
		].join('\n');

		return interaction.reply({ content: replies });
	}
}
