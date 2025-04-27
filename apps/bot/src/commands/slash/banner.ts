import { Client } from '@/lib/structures/client.js';
import { Command } from '@/lib/structures/command.js';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ButtonStyle,
	InteractionContextType,
	MessageFlags
} from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, resolveColor } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import { Colors } from '@/lib/utils/constants.js';
import axios from 'axios';

export default class extends Command {
	public constructor(client: Client<true>) {
		super(client, {
			type: ApplicationCommandType.ChatInput,
			name: 'banner',
			description: 'Display the banner of the provided user.',
			options: [
				{
					name: 'user',
					description: 'User to display.',
					type: ApplicationCommandOptionType.User,
					required: false
				},
				{
					name: 'color',
					description: "Display user's banner color.",
					type: ApplicationCommandOptionType.Boolean,
					required: false
				}
			],
			integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
			contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
			category: 'Utility'
		});
	}

	public async execute(interaction: ChatInputCommandInteraction<'cached' | 'raw'>) {
		const user = await this.client.users.fetch(interaction.options.getUser('user') ?? interaction.user, {
			force: true
		});
		const color = interaction.options.getBoolean('color') ?? false;

		const embed = new EmbedBuilder()
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() as string });

		if (color) {
			if (!user.hexAccentColor) {
				return interaction.reply({
					content: `${bold(user.tag)}'s has no banner color!`,
					flags: MessageFlags.Ephemeral
				});
			}

			const response = await axios
				.get(`http://www.thecolorapi.com/id?hex=${user.hexAccentColor.replace(/#/g, '')}`)
				.then(({ data }) => data);

			embed.setColor(resolveColor(response.hex.clean));
			embed.setDescription(
				[`${bold(italic('ID:'))} ${inlineCode(user.id)}`, `${bold(italic('Hex:'))} ${response.hex.value}`].join('\n')
			);
			embed.setImage(`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`);

			return interaction.reply({ embeds: [embed] });
		}

		if (!user.banner) {
			return interaction.reply({ content: `${bold(user.tag)}'s has no banner!`, flags: MessageFlags.Ephemeral });
		}

		const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.bannerURL({ extension: 'png', size: 4096 }) as string)
		);

		embed.setColor(Colors.Default);
		embed.setDescription(`${bold(italic('ID:'))} ${inlineCode(user.id)}`);
		embed.setImage(user.bannerURL({ size: 512 }) as string);

		return interaction.reply({ embeds: [embed], components: [button] });
	}
}
