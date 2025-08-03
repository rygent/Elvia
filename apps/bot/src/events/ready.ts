import { CoreEvent, type CoreClient } from '@elvia/core';
import { Events } from 'discord.js';
import { isExtendedSettings } from '@/lib/settings.js';
import { prisma } from '@elvia/database';

export default class extends CoreEvent {
	public constructor(client: CoreClient<true>) {
		super(client, {
			name: Events.ClientReady,
			once: true
		});
	}

	public async run() {
		if (isExtendedSettings(this.client.settings) && this.client.settings.presence) {
			this.client.user.setPresence(this.client.settings.presence);
		}

		const guilds = await this.client.guilds.fetch();
		for (const [, guild] of guilds) {
			await prisma.guild.upsert({
				where: { id: guild.id },
				create: { id: guild.id },
				update: {}
			});
		}
	}
}
