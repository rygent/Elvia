import { Client } from '@/lib/structures/client.js';
import { Listener } from '@/lib/structures/listener.js';
import {
	ContainerBuilder,
	TextDisplayBuilder,
	SeparatorBuilder,
	SectionBuilder,
	ThumbnailBuilder
} from '@discordjs/builders';
import { Events, Guild, WebhookClient, type WebhookMessageCreateOptions } from 'discord.js';
import { bold, heading, inlineCode, subtext } from '@discordjs/formatters';
import { formatNumber } from '@/lib/utils/functions.js';
import { env } from '@/env.js';
import { prisma } from '@elvia/database';

export default class extends Listener {
	public constructor(client: Client<true>) {
		super(client, {
			name: Events.GuildCreate,
			once: false
		});
	}

	public async run(guild: Guild) {
		if (!guild.available) return;
		await prisma.guild.create({ data: { id: guild.id } });

		if (env.GUILD_WEBHOOK_URL) {
			const webhook = new WebhookClient({ url: env.GUILD_WEBHOOK_URL });
			const threadId = new URL(env.GUILD_WEBHOOK_URL).searchParams.get('thread_id') as string;
			const guildOwner = await guild.fetchOwner();

			const guildCount = formatNumber(this.client.guilds.cache.size);
			const userCount = formatNumber(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0));

			const detail = new TextDisplayBuilder().setContent(
				[
					heading(`${bold(this.client.user.username)} was added to a new Server!`, 2),
					`${bold('Server:')} ${guild.name} (${inlineCode(guild.id)})`,
					`${bold('Owner:')} ${guildOwner.user.tag} (${inlineCode(guildOwner.id)})`,
					`${bold('Channels:')} ${formatNumber(guild.channels.cache.size)}`,
					`${bold('Members:')} ${formatNumber(guild.memberCount)}`
				].join('\n')
			);

			const container = new ContainerBuilder()
				.addTextDisplayComponents(detail)
				.addSeparatorComponents(new SeparatorBuilder().setDivider(true))
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(subtext(`${bold(guildCount)} guilds | ${bold(userCount)} users`))
				);

			if (guild.icon) {
				const section = new SectionBuilder()
					.addTextDisplayComponents(detail)
					.setThumbnailAccessory(new ThumbnailBuilder().setURL(guild.iconURL({ size: 1024 })!));
				container.spliceComponents(0, 1, section);
			}

			const profile = {
				avatarURL: this.client.user?.displayAvatarURL({ size: 4096 }),
				username: this.client.user?.username
			} as WebhookMessageCreateOptions;

			return webhook.send({ components: [container], withComponents: true, threadId, ...profile });
		}
	}
}
