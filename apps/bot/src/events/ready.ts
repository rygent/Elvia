import type { BaseClient } from '#lib/structures/BaseClient.js';
import { Event } from '#lib/structures/Event.js';
import { ActivityType } from 'discord-api-types/v10';
import { formatNumber } from '#lib/utils/Functions.js';
import { Env } from '@aviana/env';
import { prisma } from '@aviana/database';
import { redBright, underline } from 'colorette';

export default class extends Event {
	public constructor(client: BaseClient) {
		super(client, {
			name: 'ready',
			once: true
		});
	}

	public async run() {
		const guildCount = formatNumber(this.client.guilds.cache.size);
		const userCount = formatNumber(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0));

		this.client.logger.log(`Logged in as ${redBright(underline(`${this.client.user.tag}`))}`);
		this.client.logger.log(
			`Loaded ${formatNumber(this.client.commands.size + this.client.interactions.size)} commands & ${formatNumber(
				this.client.events.size
			)} events!`
		);

		if (Env.CustomStatus) {
			const status = Env.CustomStatus.replace('{version}', this.client.version)
				.replace('{guildCount}', guildCount)
				.replace('{userCount}', userCount);

			this.client.user.setActivity({ name: status, type: ActivityType.Custom });
		}

		const guilds = await this.client.guilds.fetch();
		for (const [, guild] of guilds) {
			await prisma.guild.upsert({
				where: { guildId: guild.id },
				create: { guildId: guild.id },
				update: {}
			});
		}
	}
}
