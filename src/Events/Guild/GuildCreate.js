import Event from '../../Structures/Event.js';
import { EmbedBuilder } from '@discordjs/builders';
import { WebhookClient, parseWebhookURL } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Colors, Links } from '../../Utils/Constants.js';
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
		await prisma.guild.create({ data: { guildId: guild.id } });

		if (Links.GuildWebhook) {
			const webhook = new WebhookClient(parseWebhookURL(Links.GuildWebhook));
			const guildOwner = await guild.fetchOwner();

			const embed = new EmbedBuilder()
				.setColor(Colors.Green)
				.setTitle(`${this.client.user.username} was added to a new Server!`)
				.setThumbnail(guild.iconURL({ size: 512 }))
				.setDescription([
					`***Server:*** ${guild.name} (\`${guild.id}\`)`,
					`***Owner:*** ${guildOwner.user.tag} (\`${guildOwner.id}\`)`,
					`***Channels:*** ${guild.channels.cache.size.formatNumber()}`,
					`***Members:*** ${guild.memberCount.formatNumber()}`
				].join('\n'))
				.setFooter({ text: `${this.client.guilds.cache.size.formatNumber()} guilds | ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).formatNumber()} users`, iconURL: this.client.user.avatarURL() });

			return webhook.send({ embeds: [embed], avatarURL: this.client.user.displayAvatarURL({ size: 4096 }), username: this.client.user.username });
		}
	}

}
