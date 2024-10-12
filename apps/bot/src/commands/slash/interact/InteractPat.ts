import { Client, Command } from '@elvia/tesseract';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType
} from 'discord-api-types/v10';
import { EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'pat',
			description: 'Pat someone.',
			options: [
				{
					name: 'user',
					description: 'User to interact with.',
					type: ApplicationCommandOptionType.User,
					required: true
				}
			],
			defaultMemberPermissions: null,
			integrationTypes: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.PrivateChannel],
			category: 'Social',
			guild: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user');

		const raw = await request(`https://nekos.best/api/v2/pat`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json().then(({ results }: any) => results[0]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${member?.toString()}, you've got a pat from ${interaction.user.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed] });
	}
}
