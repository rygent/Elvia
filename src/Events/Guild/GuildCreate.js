import Event from '../../Structures/Event.js';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, parseWebhookURL } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Colors, Links } from '../../Utils/Constants.js';
import { formatNumber } from '../../Structures/Util.js';
const prisma = new PrismaClient();

export default class extends Event {

	constructor(...args) {
		super(...args, {
			name: 'guildCreate',
			once: false
		});
	}

	async run(guild) {
		if (!guild.available) return;
		await prisma.guild.create({ data: { id: guild.id } });

		if (Links.GuildWebhook) {
			const webhook = new WebhookClient(parseWebhookURL(Links.GuildWebhook));
			const threadId = new URL(Links.GuildWebhook).searchParams.get('thread_id');
			const guildOwner = await guild.fetchOwner();

			const embed = new EmbedBuilder()
				.setColor(Colors.Green)
				.setTitle(`${this.client.user.username} was added to a new Server!`)
				.setThumbnail(guild.iconURL({ size: 512 }))
				.setDescription([
					`***Server:*** ${guild.name} (\`${guild.id}\`)`,
					`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
					`***Channels:*** ${formatNumber(guild.channels.cache.size)}`,
					`***Members:*** ${formatNumber(guild.memberCount)}`
				].join('\n'))
				.setFooter({ text: `${formatNumber(this.client.guilds.cache.size)} guilds | ${formatNumber(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))} users`, iconURL: this.client.user.avatarURL() });

			return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username, threadId });
		}
	}

}
