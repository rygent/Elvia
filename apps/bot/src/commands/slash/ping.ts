import { Client, Command } from '@elvia/tesseract';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'ping',
			description: 'Send a ping request.',
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
			category: 'General'
		});
	}

	public execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const replies = [
			`${bold(italic('Websocket:'))} ${inlineCode(`${Math.round(this.client.ws.ping)}ms`)}`,
			`${bold(italic('Latency:'))} ${inlineCode(`${Math.round(Date.now() - interaction.createdTimestamp)}ms`)}`
		].join('\n');

		return interaction.reply({ content: replies });
	}
}
