import type { BaseClient } from '@/lib/structures/BaseClient.js';
import { Interaction } from '@/lib/structures/Interaction.js';
import { EmbedBuilder } from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import { Colors, UserAgent } from '@/lib/utils/Constants.js';
import { request } from 'undici';

export default class extends Interaction {
	public constructor(client: BaseClient<true>) {
		super(client, {
			name: 'interact smug',
			description: 'Smug someone.',
			category: 'Social',
			guildOnly: true
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached'>) {
		const member = interaction.options.getMember('user');

		const raw = await request(`https://nekos.best/api/v2/smug`, {
			method: 'GET',
			headers: { 'User-Agent': UserAgent },
			maxRedirections: 20
		});

		const response = await raw.body.json().then(({ results }: any) => results[0]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setDescription(`${interaction.user.toString()} smugs at ${member?.toString()}.`)
			.setImage(response.url)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		return interaction.reply({ embeds: [embed] });
	}
}
