import type BaseClient from '#lib/BaseClient.js';
import Event from '#lib/structures/Event.js';
import { EmbedBuilder } from '@discordjs/builders';
import { Guild, WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, inlineCode, italic } from '@discordjs/formatters';
import { Colors, Links } from '#lib/utils/Constants.js';
import { formatNumber } from '#lib/utils/Function.js';
import { prisma } from '#lib/utils/Prisma.js';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'guildCreate',
			once: false
		});
	}

	public async run(guild: Guild) {
		if (!guild.available) return;
		await prisma.guild.create({ data: { id: guild.id } });

		if (Links.GuildWebhook) {
			const webhook = new WebhookClient({ url: Links.GuildWebhook });
			const threadId = new URL(Links.GuildWebhook).searchParams.get('thread_id') as string;
			const guildOwner = await guild.fetchOwner();

			const guildCount = formatNumber(this.client.guilds.cache.size);
			const userCount = formatNumber(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0));

			const embed = new EmbedBuilder()
				.setColor(Colors.Green)
				.setTitle(`${this.client.user.username} was added to a new Server!`)
				.setThumbnail(guild.iconURL({ size: 512 }))
				.setDescription(
					[
						`${bold(italic('Server:'))} ${guild.name} (${inlineCode(guild.id)})`,
						`${bold(italic('Owner:'))} ${guildOwner.user.tag} (${inlineCode(guildOwner.id)})`,
						`${bold(italic('Channels:'))} ${formatNumber(guild.channels.cache.size)}`,
						`${bold(italic('Members:'))} ${formatNumber(guild.memberCount)}`
					].join('\n')
				)
				.setFooter({
					text: `${guildCount} guilds | ${userCount} users`,
					iconURL: this.client.user.avatarURL() as string
				});

			const profile = {
				avatarURL: this.client.user?.displayAvatarURL({ size: 4096 }),
				username: this.client.user?.username
			} as WebhookMessageCreateOptions;

			return webhook.send({ embeds: [embed], threadId, ...profile });
		}
	}
}
